import { Types } from 'mongoose';
import { Assessment, IAssessment, IQuestion } from '../models/Assessment';
import { AssessmentAttempt, IAssessmentAttempt } from '../models/AssessmentAttempt';
import { UserConceptProgress } from '../models/UserConceptProgress';
import { User } from '../models/User';
import { ActivityLog } from '../models/ActivityLog';
import { QuestionType } from '@csf/shared';

export interface SubmitAnswerInput {
  questionId: string;
  response: unknown;
}

export interface GradedQuestionResult {
  questionId: string;
  type: QuestionType;
  prompt: string;
  userResponse: unknown;
  correctAnswer: unknown;
  isCorrect: boolean;
  score: number;
  points: number;
  explanation: string;
  learningObjective?: string;
  tags?: string[];
}

export interface GradedAttemptResult {
  attemptId: string;
  assessmentId: string;
  score: number;
  rawScore: number;
  maxScore: number;
  passingScore: number;
  passed: boolean;
  submittedAt: Date;
  questions: GradedQuestionResult[];
  xpEarned?: number;
}

export class AssessmentService {
  /**
   * Grade an individual question across all 7 supported question types
   */
  static gradeQuestion(
    question: IQuestion,
    response: unknown
  ): { isCorrect: boolean; score: number } {
    const points = question.points || 1;
    const correct = question.correctAnswer;

    if (response === undefined || response === null || response === '') {
      return { isCorrect: false, score: 0 };
    }

    switch (question.type) {
      case 'MCQ': {
        // Can be single string or array of strings (multi-select)
        if (Array.isArray(correct)) {
          if (!Array.isArray(response)) return { isCorrect: false, score: 0 };
          const sortedCorrect = [...correct].map(String).sort();
          const sortedResponse = [...response].map(String).sort();
          const isMatch =
            sortedCorrect.length === sortedResponse.length &&
            sortedCorrect.every((val, idx) => val === sortedResponse[idx]);
          return { isCorrect: isMatch, score: isMatch ? points : 0 };
        }
        const isMatch = String(response).trim() === String(correct).trim();
        return { isCorrect: isMatch, score: isMatch ? points : 0 };
      }

      case 'MATCHING': {
        // Response is key-value pair map { [key]: value }
        if (typeof response !== 'object' || typeof correct !== 'object') {
          return { isCorrect: false, score: 0 };
        }
        const userMap = response as Record<string, string>;
        const correctMap = correct as Record<string, string>;
        const keys = Object.keys(correctMap);
        if (keys.length === 0) return { isCorrect: false, score: 0 };

        let correctPairs = 0;
        for (const k of keys) {
          if (String(userMap[k] || '').trim().toLowerCase() === String(correctMap[k] || '').trim().toLowerCase()) {
            correctPairs++;
          }
        }
        const isAllCorrect = correctPairs === keys.length;
        const partialScore = Math.round((correctPairs / keys.length) * points * 100) / 100;
        return { isCorrect: isAllCorrect, score: isAllCorrect ? points : partialScore };
      }

      case 'SHORT_ANSWER': {
        // Keyword / regex array or string
        const userText = String(response).trim().toLowerCase();
        let isMatch = false;
        if (Array.isArray(correct)) {
          isMatch = correct.some((keyword) => userText.includes(String(keyword).toLowerCase()));
        } else {
          isMatch = userText.includes(String(correct).toLowerCase());
        }
        return { isCorrect: isMatch, score: isMatch ? points : 0 };
      }

      case 'SCENARIO': {
        // Scenario chosen option
        const isMatch = String(response).trim() === String(correct).trim();
        return { isCorrect: isMatch, score: isMatch ? points : 0 };
      }

      case 'OUTPUT_PREDICTION': {
        // String output prediction, ignoring leading/trailing whitespace
        const cleanUser = String(response).trim().replace(/\r\n/g, '\n');
        const cleanCorrect = String(correct).trim().replace(/\r\n/g, '\n');
        const isMatch = cleanUser === cleanCorrect;
        return { isCorrect: isMatch, score: isMatch ? points : 0 };
      }

      case 'MISCONCEPTION_DETECTION': {
        // Selected misconception identifier
        const isMatch = String(response).trim() === String(correct).trim();
        return { isCorrect: isMatch, score: isMatch ? points : 0 };
      }

      case 'COMPARISON': {
        // Comparison map or option
        if (typeof correct === 'object' && typeof response === 'object') {
          const userObj = response as Record<string, unknown>;
          const correctObj = correct as Record<string, unknown>;
          const isMatch = JSON.stringify(userObj) === JSON.stringify(correctObj);
          return { isCorrect: isMatch, score: isMatch ? points : 0 };
        }
        const isMatch = String(response).trim() === String(correct).trim();
        return { isCorrect: isMatch, score: isMatch ? points : 0 };
      }

      default: {
        const isMatch = JSON.stringify(response) === JSON.stringify(correct);
        return { isCorrect: isMatch, score: isMatch ? points : 0 };
      }
    }
  }

  /**
   * Start a new assessment attempt
   */
  static async startAttempt(userId: string, assessmentId: string): Promise<IAssessmentAttempt> {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const attempt = await AssessmentAttempt.create({
      userId: new Types.ObjectId(userId),
      assessmentId: assessment._id,
      status: 'IN_PROGRESS',
      score: 0,
      rawScore: 0,
      maxScore: assessment.questions.reduce((acc, q) => acc + (q.points || 1), 0),
      startedAt: new Date(),
      answers: [],
    });

    return attempt;
  }

  /**
   * Autosave an answer during an in-progress attempt
   */
  static async autosaveAnswer(
    userId: string,
    attemptId: string,
    questionId: string,
    response: unknown
  ): Promise<void> {
    const attempt = await AssessmentAttempt.findOne({
      _id: attemptId,
      userId: new Types.ObjectId(userId),
      status: 'IN_PROGRESS',
    });

    if (!attempt) {
      throw new Error('Active assessment attempt not found');
    }

    const existingAnswerIdx = attempt.answers.findIndex((a) => a.questionId === questionId);
    if (existingAnswerIdx >= 0) {
      attempt.answers[existingAnswerIdx].response = response;
    } else {
      attempt.answers.push({
        questionId,
        response,
        isCorrect: false,
        score: 0,
      });
    }

    await attempt.save();
  }

  /**
   * Submit and grade an assessment attempt (Server-Side Source of Truth)
   */
  static async submitAttempt(
    userId: string,
    assessmentId: string,
    submittedAnswers: SubmitAnswerInput[],
    attemptId?: string
  ): Promise<GradedAttemptResult> {
    // 1. Fetch assessment explicitly selecting correctAnswer and questions
    const assessment = await Assessment.findById(assessmentId).select('+questions.correctAnswer');
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // 2. Find or create attempt
    let attempt: IAssessmentAttempt | null = null;
    if (attemptId) {
      attempt = await AssessmentAttempt.findOne({
        _id: attemptId,
        userId: new Types.ObjectId(userId),
      });
    }

    if (!attempt) {
      attempt = await AssessmentAttempt.create({
        userId: new Types.ObjectId(userId),
        assessmentId: assessment._id,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      });
    }

    if (attempt.status === 'EVALUATED') {
      throw new Error('This attempt has already been evaluated');
    }

    // 3. Grade each question
    const gradedQuestions: GradedQuestionResult[] = [];
    const attemptAnswers = [];
    let rawScore = 0;
    const maxScore = assessment.questions.reduce((acc, q) => acc + (q.points || 1), 0);

    for (const question of assessment.questions) {
      const qIdStr = question._id ? question._id.toString() : '';
      const userSubmission = submittedAnswers.find((a) => a.questionId === qIdStr);
      const userResponse = userSubmission ? userSubmission.response : null;

      const { isCorrect, score } = this.gradeQuestion(question, userResponse);
      rawScore += score;

      attemptAnswers.push({
        questionId: qIdStr,
        response: userResponse,
        isCorrect,
        score,
      });

      gradedQuestions.push({
        questionId: qIdStr,
        type: question.type,
        prompt: question.prompt,
        userResponse,
        correctAnswer: question.correctAnswer,
        isCorrect,
        score,
        points: question.points || 1,
        explanation: question.explanation,
        learningObjective: question.learningObjective,
        tags: question.tags,
      });
    }

    // Calculate percentage score
    const percentageScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
    const passed = percentageScore >= assessment.passingScore;

    // 4. Update and persist attempt
    attempt.status = 'EVALUATED';
    attempt.score = percentageScore;
    attempt.rawScore = rawScore;
    attempt.maxScore = maxScore;
    attempt.submittedAt = new Date();
    attempt.answers = attemptAnswers;
    await attempt.save();

    let xpEarned = 0;

    // 5. Update user progress, XP, streak, and activity log
    if (assessment.conceptId) {
      let progress = await UserConceptProgress.findOne({
        userId: new Types.ObjectId(userId),
        conceptId: assessment.conceptId,
      });

      if (!progress) {
        progress = new UserConceptProgress({
          userId: new Types.ObjectId(userId),
          conceptId: assessment.conceptId,
          status: passed ? 'COMPLETED' : 'IN_PROGRESS',
          startedAt: new Date(),
          bestScore: percentageScore,
          attemptsCount: 1,
        });
      } else {
        progress.attemptsCount = (progress.attemptsCount || 0) + 1;
        progress.bestScore = Math.max(progress.bestScore || 0, percentageScore);
        if (passed) {
          progress.status = 'COMPLETED';
          if (!progress.completedAt) {
            progress.completedAt = new Date();
          }
        }
      }
      await progress.save();

      // Award XP on pass
      if (passed) {
        xpEarned = 100;
        await User.findByIdAndUpdate(userId, {
          $inc: { xp: xpEarned },
        });

        // Record activity log for today
        const todayStr = new Date().toISOString().split('T')[0];
        await ActivityLog.findOneAndUpdate(
          { userId: new Types.ObjectId(userId), date: todayStr },
          {
            $inc: { minutes: 15, quizzesTaken: 1, conceptsTouched: 1 },
          },
          { upsert: true }
        );
      }
    }

    return {
      attemptId: (attempt._id as Types.ObjectId).toString(),
      assessmentId: assessment._id.toString(),
      score: percentageScore,
      rawScore,
      maxScore,
      passingScore: assessment.passingScore,
      passed,
      submittedAt: attempt.submittedAt,
      questions: gradedQuestions,
      xpEarned,
    };
  }

  /**
   * Fetch evaluated attempt result (with answers and explanations)
   */
  static async getAttemptResult(
    userId: string,
    attemptId: string
  ): Promise<GradedAttemptResult> {
    const attempt = await AssessmentAttempt.findOne({
      _id: attemptId,
      userId: new Types.ObjectId(userId),
    });

    if (!attempt || attempt.status !== 'EVALUATED') {
      throw new Error('Evaluated assessment attempt not found');
    }

    const assessment = await Assessment.findById(attempt.assessmentId).select('+questions.correctAnswer');
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const gradedQuestions: GradedQuestionResult[] = assessment.questions.map((q) => {
      const qIdStr = q._id ? q._id.toString() : '';
      const savedAns = attempt.answers.find((a) => a.questionId === qIdStr);
      return {
        questionId: qIdStr,
        type: q.type,
        prompt: q.prompt,
        userResponse: savedAns?.response,
        correctAnswer: q.correctAnswer,
        isCorrect: savedAns?.isCorrect ?? false,
        score: savedAns?.score ?? 0,
        points: q.points || 1,
        explanation: q.explanation,
        learningObjective: q.learningObjective,
        tags: q.tags,
      };
    });

    return {
      attemptId: (attempt._id as Types.ObjectId).toString(),
      assessmentId: assessment._id.toString(),
      score: attempt.score,
      rawScore: attempt.rawScore,
      maxScore: attempt.maxScore,
      passingScore: assessment.passingScore,
      passed: attempt.score >= assessment.passingScore,
      submittedAt: attempt.submittedAt || new Date(),
      questions: gradedQuestions,
    };
  }

  /**
   * Get past user attempts for an assessment
   */
  static async getUserAttempts(userId: string, assessmentId: string): Promise<IAssessmentAttempt[]> {
    return AssessmentAttempt.find({
      userId: new Types.ObjectId(userId),
      assessmentId: new Types.ObjectId(assessmentId),
    }).sort({ createdAt: -1 });
  }
}

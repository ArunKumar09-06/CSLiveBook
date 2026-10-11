export interface SubjectThemeConfig {
  from: string;
  to: string;
  glow: string;
  textGlow: string;
  name: string;
}

export const SUBJECT_THEMES: Record<string, SubjectThemeConfig> = {
  dbms: {
    from: '#22D3EE',
    to: '#3B82F6',
    glow: 'rgba(34, 211, 238, 0.4)',
    textGlow: 'rgba(34, 211, 238, 0.2)',
    name: 'DBMS & SQL',
  },
  oop: {
    from: '#8B5CF6',
    to: '#D946EF',
    glow: 'rgba(139, 92, 246, 0.4)',
    textGlow: 'rgba(139, 92, 246, 0.2)',
    name: 'Object-Oriented Programming',
  },
  os: {
    from: '#FB923C',
    to: '#F43F5E',
    glow: 'rgba(251, 146, 60, 0.4)',
    textGlow: 'rgba(251, 146, 60, 0.2)',
    name: 'Operating Systems',
  },
  cn: {
    from: '#34D399',
    to: '#14B8A6',
    glow: 'rgba(52, 211, 153, 0.4)',
    textGlow: 'rgba(52, 211, 153, 0.2)',
    name: 'Computer Networks',
  },
  devops: {
    from: '#FBBF24',
    to: '#F97316',
    glow: 'rgba(251, 191, 36, 0.4)',
    textGlow: 'rgba(251, 191, 36, 0.2)',
    name: 'DevOps & Delivery',
  },
  ca: {
    from: '#38BDF8',
    to: '#64748B',
    glow: 'rgba(56, 189, 248, 0.4)',
    textGlow: 'rgba(56, 189, 248, 0.2)',
    name: 'Computer Architecture',
  },
  sd: {
    from: '#6366F1',
    to: '#A855F7',
    glow: 'rgba(99, 102, 241, 0.4)',
    textGlow: 'rgba(99, 102, 241, 0.2)',
    name: 'System Design',
  },
  ai: {
    from: '#F472B6',
    to: '#8B5CF6',
    glow: 'rgba(244, 114, 182, 0.4)',
    textGlow: 'rgba(244, 114, 182, 0.2)',
    name: 'GenAI & AI Fundamentals',
  },
};

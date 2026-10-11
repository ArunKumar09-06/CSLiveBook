import crypto from 'crypto';

/**
 * Hashes a token string using SHA-256 for secure DB storage.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generates a cryptographically secure random hex string.
 */
export const generateRandomToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

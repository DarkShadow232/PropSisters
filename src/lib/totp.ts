import { authenticator } from 'otplib';

export const generateTotpSecret = (): string => {
  return authenticator.generateSecret();
};

export const generateTotpUri = (email: string, secret: string, issuer: string): string => {
  return authenticator.keyuri(email, issuer, secret);
};

export const verifyTotpToken = (secret: string, token: string): boolean => {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
};




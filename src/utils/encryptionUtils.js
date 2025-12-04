import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'ecostyle_security_key_2025';

export const encryptPassword = (password) => {
  if (!password) return '';
  return CryptoJS.SHA256(password + ENCRYPTION_KEY).toString();
};

export const hashPassword = (password) => {
  if (!password) return '';
  return CryptoJS.SHA256(password).toString();
};

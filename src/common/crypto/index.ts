const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const initVector = '256cbcaes256cbca';
const securityKey = 'cbcaes256cbcaes256cbcaes256cbcae';

export function encrypt(message: string | Buffer) {
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector);
  let encryptedData = cipher.update(message, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}

export function decrypt(encryptedData: string | Buffer) {
  const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
}

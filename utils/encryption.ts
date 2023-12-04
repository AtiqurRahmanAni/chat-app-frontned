const CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY;

type LoginResponse = {
  id: number;
  email: string;
  tokens: {
    refresh: string;
    access: string;
  };
};

export function encryptData(data: LoginResponse) {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey
  ).toString();
  return encryptedData;
}

export function decryptData(
  encryptedData: string | undefined
): LoginResponse | null {
  if (!encryptedData) {
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

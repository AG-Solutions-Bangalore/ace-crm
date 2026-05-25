import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY || "acecrmsecretkey";

if (!import.meta.env.VITE_SECRET_KEY) {
  console.warn("VITE_SECRET_KEY is not defined in .env, falling back to default key.");
}

export const encryptId = (id) => {
  if (!id) {
    console.error("ID is missing");
    return "";
  }
  return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
};

export const decryptId = (encryptedId) => {
  try {
    if (!encryptedId) {
      console.error("Encrypted ID is missing");
      return "";
    }
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption Error:", error);
    return "";
  }
};

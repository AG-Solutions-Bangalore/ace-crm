//ace
const BASE_URL = "https://exportbiz.in/public";
export const API_URL = "https://exportbiz.in";
export const SIGN_IN_PURCHASE =
  "https://exportbiz.in/public/assets/images/sign";
export const LetterHead =
  "https://exportbiz.in/public/assets/images/letterHead";


  export const LetterHeadPdf ='https://test.exportbiz.in/letterHead'
  export const signPdf ='https://test.exportbiz.in/sign'
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  return `https://test.exportbiz.in/letterHead/${imagePath}`;
};
export const getSignUrl = (imagePath) => {
  if (!imagePath) return "";
  return `https://test.exportbiz.in/sign/${imagePath}`;
};

export default BASE_URL;
//adithiyya
// const BASE_URL = "https://adityaspice.com/public";
// export const API_URL = "https://adityaspice.com";
// export const SIGN_IN_PURCHASE =
//   "https://adityaspice.com/public/assets/images/sign/";

// export const getImageUrl = (imagePath) => {
//   if (!imagePath) return "";
//   return `${API_URL}/public/assets/images/letterHead/${imagePath}`;
// };

// export default BASE_URL;

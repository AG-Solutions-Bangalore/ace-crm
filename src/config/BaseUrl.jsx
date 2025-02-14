
  const BASE_URL = "https://exportbiz.in/public";
  export const API_URL = "https://exportbiz.in";
  export const SIGN_IN_PURCHASE = "https://exportbiz.in/public/assets/images/sign/";
  
  export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return `${API_URL}/public/assets/images/letterHead/${imagePath}`;
  };
  
  export default BASE_URL;
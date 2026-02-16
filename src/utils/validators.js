export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters
  if (password.length < 6) return false;
  
  // Contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Contains at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Contains at least one number
  if (!/\d/.test(password)) return false;
  
  return true;
};

export const validatePhone = (phone) => {
  const re = /^\+?[1-9][0-9]{7,14}$/;
  return re.test(phone);
};

export const validateCreditCard = (cardNumber) => {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's all numbers and between 13-19 digits
  if (!/^\d{13,19}$/.test(cleanNumber)) return false;
  
  // Luhn algorithm for basic validation
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export const validateExpiryDate = (expiry) => {
  const re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  if (!re.test(expiry)) return false;
  
  const [_, month, year] = expiry.match(re);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  const expiryYear = parseInt(year, 10);
  const expiryMonth = parseInt(month, 10);
  
  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, minLength) => {
  return value.toString().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value.toString().length <= maxLength;
};

export const validateNumberRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};
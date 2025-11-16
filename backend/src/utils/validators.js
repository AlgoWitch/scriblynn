import validator from 'validator';

export const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateUsername = (username) => {
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  return null;
};
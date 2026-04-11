export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password must be at least 6 characters long
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  // Username must be alphanumeric and between 3 to 15 characters
  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
  return usernameRegex.test(username);
};
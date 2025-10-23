import Cookies from "js-cookie";

export const setCookie = (key, value, options = {}) => {
  // Calculate expiration date 2 days from now
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);

  // Set the cookie with expiration date and path
  Cookies.set(key, value, { ...options, expires: expirationDate, path: "/" });
};

export const getCookie = (key) => {
  return Cookies.get(key);
};

export const removeCookie = (key) => {
  Cookies.remove(key, { path: "/" });
};

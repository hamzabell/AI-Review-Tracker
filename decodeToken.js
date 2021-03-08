import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, "aisecret");
    return decoded;
  } catch (err) {
    return null;
  }
};

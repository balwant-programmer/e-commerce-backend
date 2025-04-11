import jwt from "jsonwebtoken";
export const generateToken = (payload) => {
  try {
    const secretKey = process.env.JWT_SECRET || "yourSecretKey";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error while generating the token:", error);
    throw new Error("Token generation failed");
  }
};

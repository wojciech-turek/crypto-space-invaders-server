import "dotenv/config";
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const jwt_secret = process.env.JWT_SECRET;
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
      return res.status(401).json({
        status: "failed",
        data: "auth token not provided",
      });
    jwt.verify(token, jwt_secret, (err) => {
      if (err) {
        console.log(err.name, err.message, err.expiredAt);
        return res.status(400).json({
          status: "failed",
          data: "auth token expired",
        });
      }
      next();
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      data: "Auth Token error",
    });
  }
};

export default auth;

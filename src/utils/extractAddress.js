import "dotenv/config";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import lodash from "lodash";

const JWT_SECRET = process.env.JWT_SECRET;

const extractAddress = (req, res) => {
  let authorization = req.headers.authorization.split(" ")[1],
    decoded;
  try {
    decoded = jwt.verify(authorization, JWT_SECRET);
  } catch (e) {
    return res.status(401).send("unauthorized");
  }
  let address = decoded.data;
  address = lodash.toLower(address);
  if (!ethers.utils.isAddress(address)) {
    return res.json({
      status: "failed",
      data: "invalid address",
    });
  }
  return address;
};

export default extractAddress;

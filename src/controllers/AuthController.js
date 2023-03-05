import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import lodash from "lodash";
import { bufferToHex } from "ethereumjs-util";
import { recoverPersonalSignature } from "eth-sig-util";
import Account from "../models/account";

const JWT_SECRET = process.env.JWT_SECRET;

const getToken = async (req, res) => {
  try {
    const address = req.body.address;
    const signature = req.body.signature;
    if (!ethers.utils.isAddress(address)) {
      return res.status(400).json({
        status: "failed",
        data: "invalid address",
      });
    }

    const message = "Login/Regsiter to an account on Crypto Space Invaders";
    const msgBufferHex = bufferToHex(Buffer.from(message, "utf8"));
    const recoveredAddress = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
    if (lodash.toLower(recoveredAddress) == lodash.toLower(address)) {
      let account = await Account.findOne({ address: address });
      if (!account) {
        const newAccount = new Account();
        newAccount.address = address;
        newAccount.nonce = Math.floor(Math.random() * 9999999);
        newAccount.createdAt = Date.now();
        await newAccount.save();
      }
      const token = jwt.sign({ data: address }, JWT_SECRET, {
        expiresIn: process.env.JTW_TOKEN_EXPIRE_TIME,
      });
      return res.json({
        token,
      });
    } else {
      return res.status(400).json({
        status: "failed",
        data: "invalid signature",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      data: error.message,
    });
  }
};

export default getToken;

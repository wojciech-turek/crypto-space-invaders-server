import { bufferToHex } from "ethereumjs-util";
import { recoverPersonalSignature } from "eth-sig-util";
import Account from "../models/account";
import lodash from "lodash";

const validateSignature = async (publicKey, signature) => {
  try {
    publicKey = lodash.toLower(publicKey);
    let account = await Account.findOne({ address: publicKey });
    let nonce = account.nonce;
    let msg = `Approve Signature on Crypto Space Invaders with nonce ${nonce}`;
    let msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
    let address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
    if (lodash.toLower(address) == publicKey) {
      account.nonce = Math.floor(Math.random() * 9999999);
      await account.save();
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
};

export default validateSignature;

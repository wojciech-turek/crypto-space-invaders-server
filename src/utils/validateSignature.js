import ethUtil from "ethereumjs-util";
import sigUtil from "eth-sig-util";
import Account from "../models/account";

const validateSignature = async (publicKey, signature) => {
  try {
    publicKey = toLowerCase(publicKey);
    let account = await Account.findOne({ address: publicKey });
    let nonce = account.nonce;
    let msg = `Approve Signature on Crypto Space Invaders with nonce ${nonce}`;
    let msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
    let address = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });
    if (toLowerCase(address) == publicKey) {
      account.nonce = Math.floor(Math.random() * 9999999);
      await account.save();
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
};

export default validateSignature;

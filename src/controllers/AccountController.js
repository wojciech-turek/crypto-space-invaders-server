import mongoose from "mongoose";
const Account = mongoose.model("Account");

const getNonce = async (req, res) => {
  try {
    const address = extractAddress(req, res);
    if (!ethers.utils.isAddress(address)) {
      return res.json({
        status: "failed",
        data: "invalid address",
      });
    }
    let nonce;
    const account = await Account.findOne({ address });
    if (account) {
      nonce = account.nonce;
    } else {
      let newAccount = new Account();
      newAccount.address = address;
      newAccount.nonce = Math.floor(Math.random() * 9999999);
      newAccount.createdAt = Date.now();
      newAccount = await newAccount.save();
      nonce = newAccount.nonce;
    }
    return res.json({
      nonce,
    });
  } catch (e) {
    return res.status(e.status || 500).json({
      status: "Failed to get nonce",
      data: e.message,
    });
  }
};

export default getNonce;

import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  nonce: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
});

const Account = mongoose.model("Account", accountSchema);

export default Account;

import mongoose from "mongoose";

const gameSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  ended: {
    type: Boolean,
    required: true,
  },
  creatorAddress: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  signature: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Game = mongoose.model("Game", gameSchema);

export default Game;

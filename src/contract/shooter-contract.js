import { ethers } from "ethers";
import shooterAbi from "./shooter-abi";
import rpcProvider from "./provider";

const ownerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, rpcProvider);

const shooterContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  shooterAbi,
  ownerWallet
);

export default shooterContract;

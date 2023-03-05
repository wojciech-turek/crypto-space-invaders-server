import { ethers } from "ethers";

const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

export default rpcProvider;

import { ethers } from "ethers";

const rpcProvider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL, {
  name: "nahmii",
  chainId: 4062,
});

export default rpcProvider;

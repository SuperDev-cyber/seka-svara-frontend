import { ethers } from "ethers";

import Seka from "./abis/Seka.json";
import USDT from "./abis/usdt.json";
import { provider } from "./provider";


const sekaContract = new ethers.Contract("0xd079BbF34fD2BECa098c8C48D4742B7ef1D62A80", Seka.abi, provider);
const USDTContract = new ethers.Contract("0x5823F41428500c2CE218DD4ff42c24F3a3Fed52B", USDT.abi, provider); // ✅ Official USDT on BSC Mainnet

// "contractAddress": "0xf5e9172C29304e0ac0CdaC7599C0D530BD17d808",
// "usdtAddress": "0x55d398326f99059fF775485246999027B3197955",

// "contractAddress": "0xd079BbF34fD2BECa098c8C48D4742B7ef1D62A80",
// "usdtAddress": "0x5823F41428500c2CE218DD4ff42c24F3a3Fed52B",

// const getBalances = async() => {
//     const sekaBalance = await sekaContract.playerBalances();
//     return sekaBalance;
// }

export {
    provider,
    sekaContract,
    USDTContract
}





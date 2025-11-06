import { ethers } from "ethers";

import Seka from "./abis/Seka.json";
import USDT from "./abis/usdt.json";
import { provider } from "./provider";


const sekaContract = new ethers.Contract("0xd079BbF34fD2BECa098c8C48D4742B7ef1D62A80", Seka.abi, provider);
const USDTContract = new ethers.Contract("0x5823F41428500c2CE218DD4ff42c24F3a3Fed52B", USDT.abi, provider);

// "contractAddress": "0xd079BbF34fD2BECa098c8C48D4742B7ef1D62A80",
// "usdtAddress": "0x5823F41428500c2CE218DD4ff42c24F3a3Fed52B",

export {
    provider,
    sekaContract,
    USDTContract
}





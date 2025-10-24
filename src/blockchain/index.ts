import { ethers } from "ethers";

import Seka from "./abis/Seka.json";
import USDT from "./abis/usdt.json";
import { provider } from "./provider";


const sekaContract = new ethers.Contract("0x01BdF4098a5CD6539B8A91DB96EaF3418ed02707", Seka.abi, provider);
const usdtContract = new ethers.Contract("0xe13137C700f14b5aDbdC8A63b71a282B9557Ce9d", USDT.abi, provider);
    // Function to create ERC20 instance
// export const makeSekaInstance = (tokenAddress: string) => {
//     return new ethers.Contract(sekaContract, Seka.abi, provider);
// };

export {
    provider,
    sekaContract,
    usdtContract
}





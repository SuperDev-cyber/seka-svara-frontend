import { ethers } from "ethers";


const supportChainId = 56 // BSC Mainnet

const RPCS: { [key: number]: string } = {
    56: "https://api.web3auth.io/infura-service/v1/0x38/BDYU7Pkurgm7StMwMbJl3upFOo6-0Xgm6e0-VIsVSjjmWP7_j583kzMx4Op0dIP2tlmOw1yhHA7rmBOni8fCb0Q", // BSC Mainnet (Web3Auth bundled RPC)
    8453: "https://base-mainnet.public.blastapi.io",
    84532: 'https://base-sepolia.drpc.org',
    17000: "https://ethereum-holesky-rpc.publicnode.com",
    57054: "https://sonic-testnet.drpc.org",
    146: "https://rpc.soniclabs.com"
}

const providers = (chainId: number) => {
    if (!RPCS[chainId]) {
        throw new Error(`Unsupported chainId: ${chainId}`);
    }
    return new ethers.providers.JsonRpcProvider(RPCS[chainId]);
}

const provider = providers(supportChainId);

export { provider, supportChainId };













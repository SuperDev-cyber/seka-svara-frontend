import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';

// Web3Auth Client ID
export const WEB3AUTH_CLIENT_ID = 'BOQyVZ016XaZAzsiQzRXwNgTV5YYpj-43a3hrlrMdzS8r7jGPxTIPo25tIbmgK1zCrI545vL2GA5LBAAVIQjw-E';

// Web3Auth connection types
export enum WALLET_CONNECTORS {
  AUTH = 'AUTH',
  WALLET = 'WALLET',
}

export enum AUTH_CONNECTION {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  EMAIL = 'email',
}

type Web3AuthConfig = {
  authConnection: AUTH_CONNECTION;
  authConnectionId: string;
};

const BSC_CHAIN_ID = '0x38'; // BSC Mainnet
const BSC_TESTNET_CHAIN_ID = '0x61'; // BSC Testnet

// USDT contract address on BSC (use testnet for development)
const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'; // BSC Mainnet
const USDT_TESTNET_ADDRESS = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'; // BSC Testnet

// Simplified USDT ABI (ERC20)
const USDT_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export type Web3State = {
  account: string | null;
  balance: string | null;
  chainId: string | null;
  isConnected: boolean;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask yuklanmagan. Iltimos, MetaMask o\'rnating.');
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (!accounts || accounts.length === 0) {
      throw new Error('Hech qanday hisob topilmadi');
    }

    // Check if connected to BSC
    const chainId = await provider.send('eth_chainId', []);
    if (chainId !== BSC_CHAIN_ID && chainId !== BSC_TESTNET_CHAIN_ID) {
      await switchToBSC();
    }

    return accounts[0];
  } catch (error: any) {
    throw new Error(error.message || 'Hamyonni ulashda xatolik');
  }
}

// Connect using Web3Auth with social login
export async function connectTo(
  connector: WALLET_CONNECTORS,
  config?: Web3AuthConfig
): Promise<string> {
  if (connector === WALLET_CONNECTORS.AUTH && config) {
    return await connectWithWeb3Auth(config);
  } else {
    return await connectWallet();
  }
}

async function connectWithWeb3Auth(config: Web3AuthConfig): Promise<string> {
  try {
    // Web3Auth integration placeholder
    // In production, you would initialize Web3Auth SDK here
    console.log('Connecting with Web3Auth:', config);
    
    // For now, we'll use the standard wallet connection
    // Replace this with actual Web3Auth initialization:
    /*
    const web3auth = new Web3Auth({
      clientId: WEB3AUTH_CLIENT_ID,
      chainConfig: {
        chainNamespace: 'eip155',
        chainId: BSC_TESTNET_CHAIN_ID,
      },
    });
    
    await web3auth.initModal();
    const provider = await web3auth.connect();
    
    const ethersProvider = new BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    
    return address;
    */
    
    // Temporary fallback to MetaMask
    return await connectWallet();
  } catch (error: any) {
    throw new Error(error.message || 'Web3Auth bilan ulanishda xatolik');
  }
}

export async function switchToBSC() {
  if (!window.ethereum) {
    throw new Error('MetaMask yuklanmagan');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_TESTNET_CHAIN_ID }], // Use testnet for development
    });
  } catch (switchError: any) {
    // Chain not added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BSC_TESTNET_CHAIN_ID,
              chainName: 'BSC Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('BSC tarmoqni qo\'shishda xatolik');
      }
    } else {
      throw new Error('BSC tarmoqqa o\'tishda xatolik');
    }
  }
}

export async function getUSDTBalance(address: string): Promise<string> {
  if (!window.ethereum) {
    console.warn('MetaMask yuklanmagan');
    return '0';
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    
    // Check if we're on BSC network
    const network = await provider.getNetwork();
    const chainId = '0x' + network.chainId.toString(16);
    
    if (chainId !== BSC_CHAIN_ID && chainId !== BSC_TESTNET_CHAIN_ID) {
      console.warn('Not on BSC network');
      return '0';
    }
    
    const contract = new Contract(USDT_TESTNET_ADDRESS, USDT_ABI, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return formatUnits(balance, decimals);
  } catch (error) {
    console.error('USDT balansni olishda xatolik:', error);
    return '0';
  }
}

export async function sendUSDT(toAddress: string, amount: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask yuklanmagan');
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(USDT_TESTNET_ADDRESS, USDT_ABI, signer);
    
    const decimals = await contract.decimals();
    const amountInWei = parseUnits(amount, decimals);
    
    const tx = await contract.transfer(toAddress, amountInWei);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error: any) {
    throw new Error(error.message || 'USDT yuborishda xatolik');
  }
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Smart Contract Service
 * Handles interactions with the Seka Svara game smart contracts
 */

import { sekaContract } from "../blockchain";

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  BEP20: {
    gameContract: '0x...', // Replace with actual deployed contract address
    USDTContract: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
  },
  TRC20: {
    gameContract: 'T...', // Replace with actual deployed contract address
    USDTContract: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', // USDT on Tron
  },
};

// Game Contract ABI (simplified for Seka Svara game)
const GAME_CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "tableId", "type": "uint256"},
      {"name": "betAmount", "type": "uint256"}
    ],
    "name": "joinTable",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "tableId", "type": "uint256"},
      {"name": "action", "type": "uint8"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "makeMove",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tableId", "type": "uint256"}],
    "name": "getTableInfo",
    "outputs": [
      {"name": "pot", "type": "uint256"},
      {"name": "playerCount", "type": "uint8"},
      {"name": "currentPlayer", "type": "address"},
      {"name": "gameState", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tableId", "type": "uint256"}],
    "name": "getPlayerInfo",
    "outputs": [
      {"name": "balance", "type": "uint256"},
      {"name": "cards", "type": "uint8[]"},
      {"name": "isActive", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Game actions enum
export const GAME_ACTIONS = {
  FOLD: 0,
  CALL: 1,
  RAISE: 2,
  ALL_IN: 3,
  BET: 4,
};

class SmartContractService {
  constructor(web3Instance, network) {
    this.web3 = web3Instance;
    this.network = network;
    this.contractAddress = CONTRACT_ADDRESSES[network]?.gameContract;
    this.USDTAddress = CONTRACT_ADDRESSES[network]?.USDTContract;
    
    if (this.contractAddress && this.web3) {
      this.contract = new this.web3.eth.Contract(GAME_CONTRACT_ABI, this.contractAddress);
    }
  }

  /**
   * Join a game table
   * @param {number} tableId - Table ID to join
   * @param {number} betAmount - Amount to bet (in USDT)
   * @param {string} fromAddress - Player's address
   */
  async joinTable(tableId, betAmount, fromAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // First approve USDT transfer
      await this.approveUSDTTransfer(betAmount, fromAddress);
      
      // Then join the table
      const tx = await this.contract.methods.joinTable(tableId, betAmount).send({
        from: fromAddress,
      });

      return tx;
    } catch (error) {
      console.error('Error joining table:', error);
      throw error;
    }
  }

  /**
   * Make a game move
   * @param {number} tableId - Table ID
   * @param {number} action - Action type (fold, call, raise, etc.)
   * @param {number} amount - Amount for the action
   * @param {string} fromAddress - Player's address
   */
  async makeMove(tableId, action, amount, fromAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // If action requires USDT transfer, approve it first
      if (amount > 0) {
        await this.approveUSDTTransfer(amount, fromAddress);
      }

      const tx = await this.contract.methods.makeMove(tableId, action, amount).send({
        from: fromAddress,
      });

      return tx;
    } catch (error) {
      console.error('Error making move:', error);
      throw error;
    }
  }

  /**
   * Get table information
   * @param {number} tableId - Table ID
   */
  async getTableInfo(tableId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await this.contract.methods.getTableInfo(tableId).call();
      return {
        pot: result.pot,
        playerCount: result.playerCount,
        currentPlayer: result.currentPlayer,
        gameState: result.gameState,
      };
    } catch (error) {
      console.error('Error getting table info:', error);
      throw error;
    }
  }

  /**
   * Get player information
   * @param {number} tableId - Table ID
   * @param {string} playerAddress - Player's address
   */
  async getPlayerInfo(tableId, playerAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await this.contract.methods.getPlayerInfo(tableId).call();
      return {
        balance: result.balance,
        cards: result.cards,
        isActive: result.isActive,
      };
    } catch (error) {
      console.error('Error getting player info:', error);
      throw error;
    }
  }

  /**
   * Approve USDT transfer for the game contract
   * @param {number} amount - Amount to approve
   * @param {string} fromAddress - Player's address
   */
  async approveUSDTTransfer(amount, fromAddress) {
    if (!this.web3 || !this.USDTAddress) {
      throw new Error('Web3 or USDT contract not available');
    }

    try {
      // USDT ABI for approve function
      const USDTAbi = [
        {
          "constant": false,
          "inputs": [
            {"name": "_spender", "type": "address"},
            {"name": "_value", "type": "uint256"}
          ],
          "name": "approve",
          "outputs": [{"name": "", "type": "bool"}],
          "type": "function"
        }
      ];

      const USDTContract = new this.web3.eth.Contract(USDTAbi, this.USDTAddress);
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');

      const tx = await USDTContract.methods.approve(this.contractAddress, amountWei).send({
        from: fromAddress,
      });

      return tx;
    } catch (error) {
      console.error('Error approving USDT transfer:', error);
      throw error;
    }
  }

  /**
   * Check if player has enough USDT balance
   * @param {string} playerAddress - Player's address
   * @param {number} requiredAmount - Required amount
   */

  
  async checkUSDTBalance(playerAddress, requiredAmount) {
    if (!this.web3 || !this.USDTAddress) {
      throw new Error('Web3 or USDT contract not available');
    }

    try {
      const USDTAbi = [
        {
          "constant": true,
          "inputs": [{"name": "_owner", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"name": "balance", "type": "uint256"}],
          "type": "function"
        }
      ];

      const USDTContract = new this.web3.eth.Contract(USDTAbi, this.USDTAddress);
      const balance = await USDTContract.methods.balanceOf(playerAddress).call();
      const balanceInUSDT = this.web3.utils.fromWei(balance, 'ether');

      return parseFloat(balanceInUSDT) >= requiredAmount;
    } catch (error) {
      console.error('Error checking USDT balance:', error);
      throw error;
    }
  }
}

export default SmartContractService;

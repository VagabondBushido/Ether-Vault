<div align="center">

# ⚡ EtherVault

> Stake ETH, Earn VGB - A Modern DeFi Staking Platform

[![Contract](https://img.shields.io/badge/Sepolia-Verified-2ea44f?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/address/0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D)
[![Demo](https://img.shields.io/badge/Demo-Watch_Now-FF0000?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=XYssCK5NHHk)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

## 📺 Demo Video

<div align="center">
  <a href="https://www.youtube.com/watch?v=XYssCK5NHHk">
    <img src="https://img.youtube.com/vi/XYssCK5NHHk/maxresdefault.jpg" width="600" alt="EtherVault Demo"/>
  </a>
</div>

## 🚀 Project Overview

EtherVault is a decentralized finance (DeFi) platform that allows users to stake Ethereum (ETH) and earn Vagabond (VGB) tokens as rewards. The project demonstrates a complete staking ecosystem with a React frontend and Solidity smart contracts.

### Key Features:
- 🔒 **Secure ETH Staking**: Stake your ETH securely with minimum 0.01 ETH
- 💎 **VGB Token Rewards**: Earn VGB tokens at 10% APR
- ⏱️ **No Lock-up Period**: Withdraw your ETH anytime
- 📈 **Time-weighted Rewards**: Longer stakes = Higher rewards
- 🎨 **Modern UI**: Clean, responsive interface with real-time updates

## 💻 Technology Stack

### Frontend
- React with Vite
- Wagmi/Viem for blockchain interactions
- Material UI for sleek components
- Framer Motion for animations

### Backend (Smart Contracts)
- Solidity ^0.8.28
- OpenZeppelin contracts for security
- Foundry for development and testing

## 📊 Smart Contract Architecture

```solidity
// Staking Contract - Handles ETH staking and VGB rewards
contract StakingContract {
    mapping(address => uint256) public Balances;
    
    // Core Functions
    function stake() external payable;
    function unstake(uint256 _amount) external;
    function getRewards(address _address) external view returns (uint256);
    function claimRewards() external;
}

// VGB Token - ERC20 token for rewards
contract VagabondCoin is ERC20 {
    address public stakingContract;
    
    constructor(address _stakingContract) ERC20("Vagabond", "VGB") {
        stakingContract = _stakingContract;
    }
}
```

## 💰 Reward System

Rewards are calculated using a time-weighted formula:

```javascript
// Time-weighted reward calculation
reward = (stakedAmount * 10 * stakingDuration) / (365 days * 100)
```

| Stake Amount | Duration | VGB Reward    |
|--------------|----------|---------------|
| 1 ETH        | 30 days  | 0.0082 VGB    |
| 5 ETH        | 90 days  | 0.123 VGB     |
| 10 ETH       | 180 days | 0.493 VGB     |

## 🛡️ Security Features

- ✅ **Reentrancy Protection**: Guards against reentrant attacks
- ✅ **Pausable**: Emergency stop functionality
- ✅ **Access Control**: Owner-only sensitive functions
- ✅ **Emergency Withdrawal**: Recovery of stuck funds
- ✅ **Integer Overflow Protection**: Safe math operations

## 🔧 Getting Started

```bash
# Clone the repository
git clone https://github.com/YourUsername/EtherVault.git
cd EtherVault

# Install frontend dependencies
cd frontend
npm install

# Start frontend development server
npm run dev

# Setup backend (in another terminal)
cd backend
forge install
forge build
```

## 🌐 Deployment

The project is deployed on the Sepolia testnet:

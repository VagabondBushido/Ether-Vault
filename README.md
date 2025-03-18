<div align="center">

# ⚡ EtherVault

> A decentralized ETH staking platform with VGB token rewards

[![Contract](https://img.shields.io/badge/Sepolia-Verified-2ea44f?style=for-the-badge)](https://sepolia.etherscan.io/address/0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D)
[![Demo](https://img.shields.io/badge/YouTube-Demo-red?style=for-the-badge)](https://www.youtube.com/watch?v=XYssCK5NHHk)

</div>

## 🎯 Overview

EtherVault enables users to:
- Stake ETH and earn VGB tokens
- Minimum stake: 0.01 ETH
- Reward rate: 10% APR
- No lock-up period

## 📦 Smart Contracts

### Main Staking Contract
```solidity
contract StakingContract {
    mapping(address => uint256) public Balances;
    
    // Core Functions
    function stake() external payable;
    function unstake(uint256 _amount) external;
    function getRewards(address _address) external view returns (uint256);
    function claimRewards() external;
}
```

### VGB Token Contract
```solidity
contract VagabondCoin is ERC20 {
    address public stakingContract;
    
    constructor(address _stakingContract) ERC20("Vagabond", "VGB") {
        stakingContract = _stakingContract;
    }
}
```

## 💰 Reward System

```js
// Time-weighted reward calculation
reward = (stakedAmount * 10 * stakingDuration) / (365 days * 100)

// Example: 1 ETH staked for 30 days
1 ETH * 10% * (30/365) = 0.0082 ETH worth of VGB
```

## 🚀 Quick Start

```bash
# Install dependencies
cd frontend && npm install
cd backend && forge install

# Start development
npm run dev    # Frontend
forge build    # Backend
```

## 🔐 Contract Addresses (Sepolia)

```
Staking: 0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D
Network: Sepolia (Chain ID: 11155111)
```

## 🛡️ Security Features

- Reentrancy protection
- Pausable functionality
- Owner controls
- Emergency withdrawal
- Integer overflow checks

## 🔧 Tech Stack

```
Frontend               Backend
- React               - Solidity
- Wagmi/Viem         - Foundry
- Material-UI         - OpenZeppelin
```

## 🧪 Testing

```bash
# Smart Contract Tests
cd backend
forge test

# Frontend Tests
cd frontend
npm test
```

## 📝 Environment Setup

```bash
# frontend/.env
VITE_ALCHEMY_API_KEY=your_key_here

# backend/.env
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_key
```

---

<div align="center">
Made with 💙 using Solidity & React
</div> 
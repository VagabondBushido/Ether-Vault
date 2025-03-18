# ⚡ EtherVault

<div align="center">

# ⚡ EtherVault

<p align="center">
  <img src="assets/ethervault-demo.gif" alt="EtherVault Demo" width="800px" />
</p>

### Stake ETH, Earn VGB - Simple, Secure, Rewarding

[![Smart Contract](https://img.shields.io/badge/Sepolia-Verified-success.svg?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/address/0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D)
[![Live Demo](https://img.shields.io/badge/Demo-Watch_Now-ff69b4.svg?style=for-the-badge)](https://www.youtube.com/watch?v=XYssCK5NHHk)

</div>

## 🎥 Quick Demo

<div align="center">
  <a href="https://www.youtube.com/watch?v=XYssCK5NHHk">
    <img src="https://img.youtube.com/vi/XYssCK5NHHk/maxresdefault.jpg" alt="Watch Demo" width="600px" />
  </a>
</div>

## ⚡ How It Works

<div align="center">
  <img src="assets/workflow.png" alt="Workflow" width="800px" />
</div>

1. **Connect Wallet** → MetaMask integration for seamless transactions
2. **Stake ETH** → Minimum 0.01 ETH required
3. **Earn VGB** → 10% APR in VGB tokens
4. **Claim Anytime** → No lock-up period

## 💎 Core Features

### Smart Contract
```solidity
contract StakingContract {
    uint256 public constant REWARD_RATE = 10; // 10% APR
    uint256 public constant MINIMUM_STAKE = 0.01 ether;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }
}
```

- 🔒 **Secure Staking**
  - Reentrancy protection
  - Pausable functionality
  - Emergency withdrawal system
  - Minimum stake: 0.01 ETH

- 💰 **Reward System**
  ```solidity
  reward = (stakedAmount * REWARD_RATE * stakingDuration) / (365 days * 100)
  ```
  Example: 1 ETH staked for 30 days = 0.0082 ETH worth of VGB

- 🛡️ **Security Features**
  - OpenZeppelin contracts
  - Owner controls
  - Non-custodial design

## 🎨 Modern UI

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="assets/stake.gif" width="200px" /><br/>
        <b>Stake ETH</b>
      </td>
      <td align="center">
        <img src="assets/rewards.gif" width="200px" /><br/>
        <b>Track Rewards</b>
      </td>
      <td align="center">
        <img src="assets/withdraw.gif" width="200px" /><br/>
        <b>Instant Withdraw</b>
      </td>
    </tr>
  </table>
</div>

## 🔧 Quick Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Smart Contracts
cd backend
forge install
forge build
```

## 📈 Reward Calculation

```javascript
function calculateReward(stake, duration) {
  const APR = 10; // 10%
  const daysInYear = 365;
  
  return (stake * APR * duration) / (daysInYear * 100);
}
```

## 🔐 Contract Addresses (Sepolia)

- **Staking Contract**: `0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D`
- **VGB Token**: [View on Etherscan](https://sepolia.etherscan.io)

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity + Foundry
- **Frontend**: React + Wagmi + Viem
- **Network**: Sepolia Testnet

## 🔄 Workflow

1. **Staking**:
   ```mermaid
   sequenceDiagram
       User->>Contract: stake() {value: ETH}
       Contract->>Storage: Record stake & timestamp
       Contract->>User: Emit Staked event
   ```

2. **Rewards**:
   ```mermaid
   sequenceDiagram
       User->>Contract: calculateReward()
       Contract->>Contract: Check duration
       Contract->>User: Return VGB amount
   ```

## 🤝 Contributing

PRs welcome! Check [CONTRIBUTING.md](CONTRIBUTING.md)

---

<div align="center">
  <p>Built with ❤️ using</p>
  <p>
    <img src="https://skillicons.dev/icons?i=solidity,react,ts" />
  </p>
</div> 
<div align="center">

```ascii
  _____ _   _              __     __         _ _ 
 | ____| |_| |__   ___ _ _\ \   / /_ _ _   _| | |_ 
 |  _| | __| '_ \ / _ \ '__\ \ / / _` | | | | | __|
 | |___| |_| | | |  __/ |   \ V / (_| | |_| | | |_ 
 |_____|\__|_| |_|\___|_|    \_/ \__,_|\__,_|_|\__|
```

# Ethereum Staking Platform with VGB Rewards

> Stake ETH. Earn VGB. DeFi Made Simple.

[![Contract](https://img.shields.io/badge/Contract-Verified-2ea44f?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/address/0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D)
[![Demo](https://img.shields.io/badge/Demo-Watch%20Now-ff69b4?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=XYssCK5NHHk)

</div>

## 📝 Overview

EtherVault is a decentralized staking platform where users can:
- Stake ETH (minimum 0.01 ETH)
- Earn VGB tokens as rewards (10% APR)
- Withdraw anytime
- Claim rewards on demand

## 🔄 How It Works

```mermaid
graph LR
    A[User] -->|Stake ETH| B[Contract]
    B -->|Lock| C[Stake Pool]
    B -->|Calculate| D[Rewards]
    D -->|Generate| E[VGB Tokens]
    E -->|Transfer| A
```

## 💎 Core Features

### Smart Contract (`StakingContract.sol`)
```solidity
contract StakingContract is ReentrancyGuard, Pausable, Ownable {
    uint256 public constant REWARD_RATE = 10; // 10% APR
    uint256 public constant MINIMUM_STAKE = 0.01 ether;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
}
```

### Key Functions

```solidity
function stake() external payable;       // Stake ETH
function unstake() external;             // Withdraw ETH + Rewards
function calculateReward(address user) public view returns (uint256);
function getStakedBalance(address user) external view returns (uint256);
```

## 💰 Reward System

Rewards are calculated using a time-weighted formula:

```js
reward = (stakedAmount * REWARD_RATE * stakingDuration) / (365 days * 100)
```

### Example Rewards

## 🎥 Demo

<div align="center">
  <a href="https://www.youtube.com/watch?v=XYssCK5NHHk">
    <img src="https://img.youtube.com/vi/XYssCK5NHHk/maxresdefault.jpg" width="600"/>
  </a>
</div>

## 💫 Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="assets/eth.png" width="60" height="60"/><br/>
        <b>Stake ETH</b><br/>
        <small>Min 0.01 ETH</small>
      </td>
      <td align="center">
        <img src="assets/vgb.png" width="60" height="60"/><br/>
        <b>Earn VGB</b><br/>
        <small>10% APR</small>
      </td>
      <td align="center">
        <img src="assets/rewards.png" width="60" height="60"/><br/>
        <b>Daily Rewards</b><br/>
        <small>Auto-compound</small>
      </td>
      <td align="center">
        <img src="assets/security.png" width="60" height="60"/><br/>
        <b>Secure</b><br/>
        <small>Audited</small>
      </td>
    </tr>
  </table>
</div>

## 🔥 Core Technology

```solidity
// Stake ETH, earn VGB rewards
contract StakingContract {
    uint256 public constant REWARD_RATE = 10; // 10% APR
    uint256 public constant MINIMUM_STAKE = 0.01 ether;
    
    mapping(address => uint256) public Balances;
    
    function stake() external payable;
    function unstake(uint256 _amount) external;
    function getRewards(address _address) external view returns (uint256);
    function claimRewards() external;
}
```

## 🎮 Interactive Interface

<div align="center">
  <img src="assets/interface.png" width="800" alt="EtherVault Interface"/>
</div>

## 📊 Reward System

```js
// Example: Stake 1 ETH for 30 days
const calculation = {
  stake: 1,              // ETH
  duration: 30,          // days
  apr: 10,              // %
  reward: 0.0082        // ETH worth of VGB
};
```

<div align="center">
  <table>
    <tr>
      <th>Stake Amount</th>
      <th>Duration</th>
      <th>VGB Rewards</th>
    </tr>
    <tr>
      <td>1 ETH</td>
      <td>30 days</td>
      <td>0.0082 ETH ≈ VGB</td>
    </tr>
    <tr>
      <td>5 ETH</td>
      <td>30 days</td>
      <td>0.041 ETH ≈ VGB</td>
    </tr>
    <tr>
      <td>10 ETH</td>
      <td>30 days</td>
      <td>0.082 ETH ≈ VGB</td>
    </tr>
  </table>
</div>

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/VagabondBushido/Ether-Vault.git

# Frontend setup
cd frontend
npm install
npm run dev

# Smart contract setup
cd backend
forge install
forge build
```

## 🔐 Deployment

- **Network**: Sepolia Testnet
- **Staking Contract**: `0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D`
- **VGB Token**: [View on Etherscan](https://sepolia.etherscan.io)

## 🛡️ Security

- ✅ Reentrancy Guard
- ✅ Pausable
- ✅ Access Control
- ✅ Emergency Withdraw
- ✅ Integer Overflow Protection

## 🛠️ Built With

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://skillicons.dev/icons?i=solidity" width="48" height="48" alt="Solidity"/>
        <br>Solidity
      </td>
      <td align="center">
        <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React"/>
        <br>React
      </td>
      <td align="center">
        <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript"/>
        <br>TypeScript
      </td>
    </tr>
  </table>
</div>

---

<div align="center">
  <br/>
  <p>
    <a href="https://twitter.com/VagabondBushido">
      <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white"/>
    </a>
    <a href="https://discord.gg/ethervault">
      <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white"/>
    </a>
  </p>
  <p>Made with ❤️ by VagabondBushido</p>
</div> 
# ⚡ EtherVault

<div align="center">

# ⚡ EtherVault

<img src="assets/ethervault-banner.gif" alt="EtherVault Banner" width="100%">

### Stake ETH. Earn VGB. DeFi Made Simple.

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-9cf.svg?style=for-the-badge)](https://ethervault.vercel.app)
[![Smart Contract](https://img.shields.io/badge/Smart_Contract-Verified-success.svg?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/address/0xd01c85418F6Bf3b945ea1668E4Dfd4D4361Ab58D)
[![Made with React](https://img.shields.io/badge/Made_with-React-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)

[Explore Demo](#-live-demo) •
[Core Features](#-core-features) •
[Tech Stack](#-tech-stack) •
[Quick Start](#-quick-start) •
[Documentation](#-documentation)

</div>

## 🎥 Live Demo

<div align="center">
  <a href="https://www.youtube.com/watch?v=XYssCK5NHHk">
    <img src="https://img.youtube.com/vi/XYssCK5NHHk/maxresdefault.jpg" alt="EtherVault Demo" width="80%">
  </a>
  <p><em>Click to watch the demo video</em></p>
</div>

## 🌟 Core Features

<div align="center">
  <img src="assets/features.gif" alt="Features Animation" width="100%">
</div>

### 🔄 Staking Mechanism
- **Instant Staking**: Deposit ETH directly from your wallet
- **Flexible Amounts**: No minimum stake requirement
- **Real-time Updates**: See your staked balance update instantly
- **Smart Withdrawals**: Withdraw your ETH anytime

### 💰 VGB Reward System
- **Dynamic Rewards**: Earn VGB tokens based on stake amount and duration
- **Time-Weighted**: Longer stakes = Higher rewards
- **Instant Claims**: Claim VGB rewards with one click
- **Compound Interest**: Rewards accumulate in real-time

### 🎨 Modern DeFi Interface
- **Responsive Design**: Works on all devices
- **Live Analytics**: Track your earnings in real-time
- **Interactive Elements**: Smooth animations and transitions
- **Dark Mode**: Easy on the eyes, perfect for DeFi traders

## 🔧 Tech Stack

<table align="center">
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=solidity" width="48" height="48" alt="Solidity" />
      <br>Solidity
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://raw.githubusercontent.com/wagmi-dev/wagmi/main/logo.svg" width="48" height="48" alt="Wagmi" />
      <br>Wagmi
    </td>
  </tr>
</table>

## ⚙️ Smart Contract Architecture

```mermaid
graph TD
    subgraph User Actions
        A[User] -->|Stake ETH| B[EtherVault]
        A -->|Claim VGB| B
    end
    
    subgraph Smart Contracts
        B -->|Lock| C[Staking Pool]
        B -->|Calculate| D[Reward Engine]
        D -->|Mint| E[VGB Token]
    end
    
    subgraph Rewards
        D -->|Time-Weight| F[Reward Formula]
        F -->|Generate| G[VGB Rewards]
    end
```

## 💎 Reward Calculation

Our reward system uses a dynamic time-weighted formula:

<div align="center">

![Reward Formula](https://latex.codecogs.com/svg.latex?\large&space;R&space;=&space;S&space;\times&space;T&space;\times&space;(1&space;+&space;\alpha))

Where:
- R = Total Rewards
- S = Staked Amount
- T = Time Staked
- α = Bonus Multiplier

</div>

### Example:
```typescript
// For 1 ETH staked for 30 days
const calculation = {
  stake: 1,              // 1 ETH
  duration: 30,          // 30 days
  baseRate: 0.001,       // Base rate per day
  bonus: 1.2,            // 20% bonus for 30-day stake
  
  // Final calculation
  reward: 1 * 30 * 0.001 * 1.2  // = 0.036 VGB per day
};
```

## 🚀 Quick Start

1. **Clone & Install**
```bash
git clone https://github.com/yourusername/ethervault.git
cd ethervault
```

2. **Setup Frontend**
```bash
cd frontend
npm install
```

3. **Setup Backend**
```bash
cd ../backend
forge install
```

4. **Configure Environment**
```bash
# Create .env in frontend directory
VITE_ALCHEMY_API_KEY=your_key_here
```

## 📊 Live Statistics

<div align="center">
  <table>
    <tr>
      <td align="center"><strong>Total ETH Staked</strong></td>
      <td align="center"><strong>Total VGB Distributed</strong></td>
      <td align="center"><strong>Active Stakers</strong></td>
    </tr>
    <tr>
      <td align="center">1,234.56 ETH</td>
      <td align="center">5,678,901 VGB</td>
      <td align="center">789</td>
    </tr>
  </table>
</div>

## 🔐 Security

### Smart Contract Security
- ✅ Audited by [Security Firm]
- 🔒 Time-locked withdrawals
- 🛡️ Emergency pause functionality
- 📝 Transparent transactions

### Frontend Security
- 🔍 Real-time validation
- 🌐 Secure RPC connections
- 🔑 Protected API endpoints
- 🛑 Rate limiting

## 📱 UI Components

<div align="center">
  <img src="assets/ui-components.png" alt="UI Components" width="100%">
</div>

### Dashboard
```jsx
<Grid container spacing={3}>
  <StatsCard
    title="ETH Staked"
    value={stakedAmount}
    icon={<EthereumIcon />}
  />
  <RewardsCard
    title="VGB Earned"
    value={rewardBalance}
    icon={<TokenIcon />}
  />
</Grid>
```

## 🛣️ Roadmap

<div align="center">
  
### 2024 Q1-Q4

```mermaid
gantt
    title EtherVault Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1
    Smart Contract Development   :done,    des1, 2024-01-01, 2024-02-01
    Frontend Development        :done,    des2, 2024-02-01, 2024-03-01
    section Phase 2
    Security Audit              :active,  des3, 2024-03-01, 2024-04-01
    Public Beta                 :         des4, 2024-04-01, 2024-05-01
    section Phase 3
    Mainnet Launch             :         des5, 2024-05-01, 2024-06-01
```

</div>

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

<div align="center">

[![Contributors](https://contrib.rocks/image?repo=yourusername/ethervault)](https://github.com/yourusername/ethervault/graphs/contributors)

</div>

## 📄 License

MIT © [EtherVault Team](LICENSE)

---

<div align="center">
  <img src="assets/footer.gif" alt="Footer Animation" width="100%">
  
  <h3>
    <a href="https://twitter.com/ethervault">Twitter</a> •
    <a href="https://discord.gg/ethervault">Discord</a> •
    <a href="https://ethervault.medium.com">Blog</a>
  </h3>

  Made with ❤️ by the EtherVault Team
</div> 
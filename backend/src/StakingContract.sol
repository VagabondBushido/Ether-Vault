// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "openzeppelin-contracts/security/ReentrancyGuard.sol";
import "openzeppelin-contracts/security/Pausable.sol";
import "openzeppelin-contracts/access/Ownable.sol";

contract StakingContract is ReentrancyGuard, Pausable, Ownable {
    // Staking token is ETH
    uint256 public constant REWARD_RATE = 10; // 10% APR
    uint256 public constant MINIMUM_STAKE = 0.01 ether;
    
    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardPaid(address indexed user, uint256 reward);
    
    constructor() {
        // Contract starts unpaused by default, no need to call _unpause()
    }
    
    function stake() external payable nonReentrant whenNotPaused {
        require(msg.value >= MINIMUM_STAKE, "Stake amount too low");
        require(stakes[msg.sender].amount == 0, "Already staking");
        
        stakes[msg.sender] = Stake({
            amount: msg.value,
            timestamp: block.timestamp
        });
        
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }
    
    function unstake() external nonReentrant {
        Stake memory userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake found");
        
        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = userStake.amount + reward;
        
        require(address(this).balance >= totalAmount, "Insufficient contract balance");
        
        delete stakes[msg.sender];
        totalStaked -= userStake.amount;
        
        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        require(success, "Transfer failed");
        
        emit Unstaked(msg.sender, userStake.amount, reward);
        emit RewardPaid(msg.sender, reward);
    }
    
    function calculateReward(address user) public view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 stakingDuration = block.timestamp - userStake.timestamp;
        return (userStake.amount * REWARD_RATE * stakingDuration) / (365 days * 100);
    }
    
    function getStakedBalance(address user) external view returns (uint256) {
        return stakes[user].amount;
    }
    
    function getReward(address user) external view returns (uint256) {
        return calculateReward(user);
    }
    
    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    receive() external payable {
        // Allow the contract to receive ETH
    }
    
    // Emergency function to recover stuck ETH (only owner)
    function emergencyWithdraw() external onlyOwner {
        require(address(this).balance > totalStaked, "Cannot withdraw staked amounts");
        uint256 withdrawableAmount = address(this).balance - totalStaked;
        (bool success, ) = payable(owner()).call{value: withdrawableAmount}("");
        require(success, "Transfer failed");
    }
} 
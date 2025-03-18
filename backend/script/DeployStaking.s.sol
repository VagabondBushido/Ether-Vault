// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {StakingContract} from "../src/StakingContract.sol";

contract DeployStaking is Script {
    function run() public returns (StakingContract) {
        vm.startBroadcast();
        
        StakingContract staking = new StakingContract();
        
        vm.stopBroadcast();
        return staking;
    }
} 
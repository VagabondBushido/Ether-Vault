// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {Staking} from "../src/Staking.sol";
import {VagabondCoin} from "../src/VagabondCoin.sol";

contract Deploy is Script {
    function run() public returns (Staking, VagabondCoin) {
        vm.startBroadcast();
        
        // Deploy VagabondCoin first with a temporary address
        VagabondCoin token = new VagabondCoin(address(0));
        
        // Deploy Staking with VagabondCoin address
        Staking staking = new Staking(address(token));
        
        // Update VagabondCoin's staking contract address
        token.updateStakingContract(address(staking));
        
        vm.stopBroadcast();
        return (staking, token);
    }
} 
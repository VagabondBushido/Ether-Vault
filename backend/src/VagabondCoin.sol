// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.28;
import "openzeppelin-contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/access/Ownable.sol";

contract VagabondCoin is ERC20, Ownable {
    address public stakingContract;
    constructor(address _stakingContract) ERC20("Vagabond", "VGB") {
        stakingContract = _stakingContract;
    }
    function mint(address to, uint256 amount) public   {
        require(msg.sender == stakingContract, "Only staking contract can mint");
        _mint(to, amount);
    }
    function updateStakingContract(address _stakingContract) public onlyOwner  {
        stakingContract = _stakingContract;
    }
}

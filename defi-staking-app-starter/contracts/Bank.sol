// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Tether.sol";
import "./JavuToken.sol";

contract Bank {
    string public name = "Bank of Crypto";
    address public owner;
    Tether public tether;
    JavuToken public javuToken;
    address[] public stakers;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public stakingBalance;
    uint256 private constant STAKE_PERCENTAGE = 10;

    constructor(Tether _tether, JavuToken _javuToken) {
        tether = _tether;
        javuToken = _javuToken;
        owner = msg.sender;
    }

    // Stake/deposit token
    function depositToken(uint256 _amount) public {
        // make sure staking amount is greater than 0
        require(_amount > 0, "staking amount must be greater than zero");

        // transfer tether token to smart contract for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // update staking balance of sender
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // check if sender has staked. otherwise, add to list of stakers
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Issue rewards/tokens to customer
    function issueToken() public {
        require(msg.sender == owner, "caller must be the  owner");
        for (uint256 index = 0; index < stakers.length; index++) {
            address staker = stakers[index];
            uint256 balance = stakingBalance[staker];
            uint256 rewardAmount = balance / STAKE_PERCENTAGE;
            // transfer reward to staker/customer
            if (balance > 0) {
                javuToken.transfer(staker, rewardAmount);
            }
        }
    }

    // Unstake token
    function unstakeToken() public {
        // get customer staking balance
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "No token available to unstake");
        //transfer tether token to customer from smart contract
        tether.transfer(msg.sender, balance);

        //update staking balance
        stakingBalance[msg.sender] = 0;

        //update staking status.
        isStaking[msg.sender] = false;
    }
}

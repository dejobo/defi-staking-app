// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Tether {
    string public name = "Mocked Tether Token";
    string public symbol = "mUSDT";
    uint256 public totalSupply = 1000000000000000000 * 1000000; //1 millions tokens
    uint8 public decimals = 18;
    address public minter = msg.sender;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowed;

    constructor() {
        // set minter's balance  to the total supply
        balanceOf[minter] = totalSupply;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function transfer(address to, uint256 value) public returns (bool success) {
        // validate account balance
        require(balanceOf[msg.sender] > value);

        // subtract value from balance
        balanceOf[msg.sender] -= value;

        // add to the receiver's balance
        balanceOf[to] += value;

        // emit to the world!
        emit Transfer(msg.sender, to, value);

        // return true if successful
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool success) {
        uint256 allowedValue = allowed[from][msg.sender];
        require(
            balanceOf[from] >= value && allowedValue >= value,
            "token balance or allowance is lower than amount requested"
        );
        balanceOf[to] += value;
        balanceOf[from] -= value;

        allowed[from][msg.sender] -= value;

        emit Transfer(from, to, value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function getBalance(address accountAddress) public view returns (uint256) {
        return balanceOf[accountAddress];
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }
}

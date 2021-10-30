//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Torikae is Ownable {
    uint256 public fee; // fee is out of 100000
    address public chainLinkCallerAddress;

    modifier onlyChainlink() {
        require(msg.sender == chainLinkCallerAddress, "Ownable: caller is not the owner");
        _;
    }

    struct Pool {
        string xChain;
        address sToken; // ERC20 token in the same chain
        string xToken;  // Token in the cross chain
    }

    mapping (bytes32 => uint256) public balances;
    mapping (bytes32 => bool) public poolIsPresent;

    constructor(uint256 _fee, address _chainLinkCallerAddress) {
        fee = _fee;
        chainLinkCallerAddress = _chainLinkCallerAddress;
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function setCaller(address newCallerAddress) public onlyOwner {
        chainLinkCallerAddress = newCallerAddress;
    }

    // Function to create pool
    function createPool(string memory _xChain, address _sToken, string memory _xToken) public {
        require(_sToken != address(0), "sToken cannot be 0x0");

        Pool memory pool = Pool(_xChain, _sToken, _xToken);
        bytes32 poolHash = keccak256(abi.encodePacked(pool.xChain, pool.sToken, pool.xToken));

        require(!poolIsPresent[poolHash], "Pool already exists");

        poolIsPresent[poolHash] = true;
        balances[poolHash] = 0;
    }

    // Function to create pool with initial liquidity
    function createPoolWithLiquidity(string memory _xChain, address _sToken, string memory _xToken, uint256 _initialLiquidity) public {
        require(_sToken != address(0), "sToken cannot be 0x0");

        Pool memory pool = Pool(_xChain, _sToken, _xToken);
        bytes32 poolHash = keccak256(abi.encodePacked(pool.xChain, pool.sToken, pool.xToken));

        require(!poolIsPresent[poolHash], "Pool already exists");

        // Take token from the caller
        IERC20(_sToken).transferFrom(msg.sender, address(this), _initialLiquidity);

        poolIsPresent[poolHash] = true;
        balances[poolHash] = _initialLiquidity;
    }

    // Function to add liquidity
    function addLiquidity(string memory _xChain, address _sToken, string memory _xToken, uint256 _amount) public {

        Pool memory pool = Pool(_xChain, _sToken, _xToken);
        bytes32 poolHash = keccak256(abi.encodePacked(pool.xChain, pool.sToken, pool.xToken));
        require(poolIsPresent[poolHash], "Pool does not exist");

        // Take token from the caller
        IERC20(_sToken).transferFrom(msg.sender, address(this), _amount);
        balances[poolHash] += _amount;
    }

    // Function to get the balance of the pool
    function getPoolBalance(string memory _xChain, address _sToken, string memory _xToken) public view returns (uint256) {
        Pool memory pool = Pool(_xChain, _sToken, _xToken);
        bytes32 poolHash = keccak256(abi.encodePacked(pool.xChain, pool.sToken, pool.xToken));

        return balances[poolHash];
    }

    // Function to call Chainlink external adpater

    // Function be be called by Chainlink external adapter
    function giveout(bytes32 poolHash, address tokenAddress, address receiverAddress, uint256 amount) public onlyChainlink {
        require(tokenAddress != address(0), "Token address is not valid");
        require(receiverAddress != address(0), "Receiver address is not valid");
        require(amount > 0, "Amount is not valid");

        // Transfer the token
        IERC20(tokenAddress).transfer(receiverAddress, amount);

        // Reduce the balance from pool
        balances[poolHash] -= amount;
    }
}

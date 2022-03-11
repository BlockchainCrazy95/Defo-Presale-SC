//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title Defo Ruby Node Minting Contract
/// @notice Contract for minting ruby nodes
contract RubyNode is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private supply;

    bool public activeSale = true;
    uint64 public maxTotalRubyNodes = 180; // total supply of ruby nodes
    uint64 public maxNodesPerWallet = 5; // max number of ruby nodes one can hold per wallet
    uint64 priceDiscount = 1000; // a dynamic price discount based on supply
    uint256 rubyNodePrice = 800; // the current price for minting a ruby node
    string private baseURI;

    /// @notice DAI token address
    IERC20 DAIToken;

    constructor(address DAI_address) ERC721("Defo Ruby Node", "DRN") {
        DAIToken = IERC20(DAI_address);
    }

    /// @notice function for getting current price based on remaining supply
    function getPrice() public view returns (uint256) {
        uint256 dynamicPrice = rubyNodePrice;
        if (supply.current() < 60) {
            dynamicPrice = dynamicPrice.sub(
                (rubyNodePrice * priceDiscount) / 10000 //calculated in bp (basis points)
            );
        } else if (supply.current() > 60 && supply.current() < 120) {
            dynamicPrice = rubyNodePrice;
        } else {
            uint256 feeAdd = (rubyNodePrice * priceDiscount) / 10000;
            dynamicPrice = rubyNodePrice.add(feeAdd);
        }
        return (dynamicPrice);
    }

    function mintNodeBatch(uint256 _amount) public payable {
        uint256 checkBalance = balanceOf(msg.sender).add(_amount);
        uint256 requiredPrice = getPrice() * _amount;
        require(activeSale = true, "Sale is not currently active");
        require(checkBalance <= maxNodesPerWallet, "Cannot mint more than `maxNodePerWallet` nodes");
        require(supply.current() <= maxTotalRubyNodes, "No more ruby nodes to mint");
        require(
           DAIToken.balanceOf(msg.sender) > requiredPrice,
           "Insuffucient DAI balance"
        );

        DAIToken.transferFrom(msg.sender, address(this), requiredPrice);
        for (uint256 i = 1; i <= _amount; i++) {
            supply.increment();
            _safeMint(msg.sender, supply.current());
        }
    }

    /// @notice allows users to mint ruby nodes
    function mintNode(uint256 _amount) public payable {
        mintNodeBatch(_amount);
    }

    /// @notice allows the owner to set the total amount of ruby nodes
    function setMaxTotalRubyNodes(uint64 _newNodeAmount) external onlyOwner {
        maxTotalRubyNodes = _newNodeAmount;
    }

    /// @notice allows the owner to render the sale inactive/active, in other words pausing and resuming
    function setSaleState() external onlyOwner {
        activeSale = !activeSale;
    }

    ///@notice allows the owner to set the max amount of nodes one wallet can hold
    function setMaxPerWallet(uint64 _newAmount) external onlyOwner {
        maxNodesPerWallet = _newAmount;
    }

    /// @notice allows the owner to set the baseURI
    function setBaseURI(string memory _tokenBaseURI) external onlyOwner {
        baseURI = _tokenBaseURI;
    }

    /// @notice returns the baseURI
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /// @notice allows owner to withdraw DAI tokens in this contract
    function withdrawTokens() public onlyOwner {
        DAIToken.transferFrom(
            address(this),
            msg.sender,
            DAIToken.balanceOf(address(this))
        );
    }

    function totalSupply() public view override returns(uint256) {
        return (supply.current());
    }
}

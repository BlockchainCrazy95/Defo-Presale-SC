//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title Defo Sapphire Node Minting Contract
/// @notice Contract for minting sapphire nodes


contract SapphireNode is ERC721Enumerable, Ownable{
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private supply;

    bool public activeSale = true;
    uint64 public maxTotalSapphireNodes = 360; // total supply of sapphire nodes
    uint64 public maxNodesPerWallet = 10; // max number of sapphire nodes one can hold per wallet
    uint64 priceDiscount = 1000; // a dynamic price discount based on supply
    uint256 sapphireNodePrice = 600; // the current price for minting a sapphire node
    string private baseURI;

    /// @notice DAI mainnet token address 0xd586E7F844cEa2F87f50152665BCbc2C279D8d70
    /// @dev will have to change address for testnet launch
    IERC20 DAIToken;

    constructor(address DAI_address) ERC721("Defo Sapphire Node", "DSN") {
        DAIToken = IERC20(DAI_address);
    }

    /// @notice function for getting current price based on remaining supply
    function getPrice() public view returns (uint256) {
        uint256 dynamicPrice = sapphireNodePrice;
        if (supply.current() < 120) {
            dynamicPrice = dynamicPrice.sub(
                (sapphireNodePrice * priceDiscount) / 10000 //calculated in bp (basis points)
            );
        } else if (supply.current() > 120 && supply.current() < 240) {
            dynamicPrice = sapphireNodePrice;
        } else {
            uint256 feeAdd = (sapphireNodePrice * priceDiscount) / 10000;
            dynamicPrice = sapphireNodePrice.add(feeAdd);
        }
        return (dynamicPrice);
    }

    /// @dev batch mint function allows for the saving of gas
    function mintNodeBatch(uint256 _amount) public payable {
        uint256 checkBalance = balanceOf(msg.sender).add(_amount);
        uint256 requiredPrice = getPrice() * _amount;
        require(activeSale = true, "Sale is not currently active");
        require(checkBalance <= maxNodesPerWallet, "Cannot mint more than `maxNodePerWallet` nodes");
        require(supply.current() <= maxTotalSapphireNodes, "No more sapphire nodes to mint");
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

    /// @notice allows users to mint sapphire nodes
    function mintNode(uint256 _amount) public payable {
        mintNodeBatch(_amount);
    }

    /// @notice allows the owner to set the total amount of sapphire nodes
    function setMaxTotalSapphireNodes(uint64 _newNodeAmount) external onlyOwner {
        maxTotalSapphireNodes = _newNodeAmount;
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

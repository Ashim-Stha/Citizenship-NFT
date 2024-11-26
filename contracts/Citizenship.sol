//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Citizenship is ERC721 {
    uint256 private s_tokenCounter;
    string internal i_tokenURI;
    mapping(address => uint256) public s_addressToTokenCounter;
    mapping(uint256 => string) public s_tokenIdToTokenUri;

    constructor(string memory tokenUri) ERC721("Citizenship", "C") {
        s_tokenCounter = 0;
        i_tokenURI = tokenUri;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
        s_addressToTokenCounter[msg.sender] = s_tokenCounter;
        s_tokenIdToTokenUri[s_tokenCounter] = i_tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return s_tokenIdToTokenUri[tokenId];
    }
}

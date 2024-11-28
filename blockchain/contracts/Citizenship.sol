//SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Citizenship is ERC721URIStorage {
    uint256 private s_tokenCounter;
    // string internal i_tokenURI;
    // mapping(address => uint256) public s_addressToTokenCounter;
    // mapping(uint256 => string) public s_tokenIdToTokenUri;
    mapping (string=>uint256) private  s_citizenshipIdToTokenId;
    mapping(string=>bool) private s_mintedCitizenshipId;

    constructor() ERC721("Citizenship", "C") {
        // s_tokenCounter = 0;
        // i_tokenURI = tokenUri;
    }

    function mintNft(string memory tokenUri,string memory citizenshipId) public {
        require(!s_mintedCitizenshipId[citizenshipId],"Token already minted for this citizenshipId");
        s_tokenCounter += 1;
        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter,tokenUri);
        s_citizenshipIdToTokenId[citizenshipId]=s_tokenCounter;
        s_mintedCitizenshipId[citizenshipId]=true;
        
        // s_addressToTokenCounter[msg.sender] = s_tokenCounter;
        // s_tokenIdToTokenUri[s_tokenCounter] = tokenUri;
    }

   function getTokenByCitizenshipId(string memory citizenshipId) external view returns(uint256 tokenId){
    return s_citizenshipIdToTokenId[citizenshipId];
   }

   function getTokenUri(uint256 tokenId) public view returns (string memory){
       // require(_exists(tokenId),"Invalid Token");
        return tokenURI(tokenId);
   }

   function getTokenUriByCitizenshipId(string memory citizenshipId) external view returns(string memory){
    uint256 tokenId=s_citizenshipIdToTokenId[citizenshipId];
    return tokenURI(tokenId);
   }

}

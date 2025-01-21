
# Citizenship NFT Project

This project is a decentralized application (dApp) for minting and managing Citizenship NFTs. It consists of a blockchain component using Hardhat and a server component using Express.js.

1. **Blockchain Component**: This component is built using Hardhat, a development environment for Ethereum software. It includes smart contracts written in Solidity, which define the logic for minting and managing Citizenship NFTs. The smart contracts are deployed to the Ethereum network, and interactions with these contracts are facilitated through the Hardhat framework.

2. **Server Component**: This component is built using Express.js, a web application framework for Node.js. It provides a RESTful API for interacting with the blockchain component. The server handles requests for minting new NFTs, retrieving token information, and uploading files to IPFS (InterPlanetary File System) using Pinata, a service for managing IPFS content.

The combination of these components allows users to mint unique Citizenship NFTs, store metadata and images on IPFS, and interact with the Ethereum blockchain through a user-friendly API. This ensures a decentralized and secure way to manage digital citizenship credentials.

## Project Structure

```
.gitignore
blockchain/
	.env
	artifacts/
		@chainlink/
		@openzeppelin/
		base64-sol/
		build-info/
		contracts/
		hardhat/
	cache/
		solidity-files-cache.json
	contracts/
		Citizenship.sol
	deploy/
		00-deploy-citizenship.js
	deployments/
		localhost/
		sepolia/
	hardhat.config.js
	helper-hardhat-config.js
	images/
		dynamicNft/
		randomNft/
	package.json
	utils/
		uploadPinata.js
		...
server/
	.env
	config/
		constants.js
	controllers/
	index.js
	middleware/
	package.json
	routes/
	uploads/
```

## Prerequisites

- Node.js
- npm
- Hardhat
- Pinata account for IPFS storage

## Setup

1. Clone the repository:

```sh
git clone <repository-url>
cd <repository-directory>
```

2. Install dependencies:

```sh
cd blockchain
npm install

cd ../server
npm install
```

3. Create a `.env` file in both 

blockchain

 and 

server

 directories with the following variables:

```sh
# blockchain/.env
PRIVATE_KEY=<your-private-key>
SEPOLIA_RPC_URL=<your-sepolia-rpc-url>
ETHERSCAN_API_KEY=<your-etherscan-api-key>
PINATA_API_KEY=<your-pinata-api-key>
PINATA_API_SECRET=<your-pinata-api-secret>

# server/.env
PRIVATE_KEY=<your-private-key>
PINATA_API_KEY=<your-pinata-api-key>
PINATA_API_SECRET=<your-pinata-api-secret>
```

## Running the Project

### Blockchain

1. Compile the smart contracts:

```sh
cd blockchain
npx hardhat compile
```

2. Deploy the smart contracts:

```sh
npx hardhat deploy --network <network-name>
```

### Server

1. Start the server:

```sh
cd server
node index.js
```

The server will run on `http://localhost:3000`.

## API Endpoints

### Smart Contract Interactions

- `GET /connect`: Connect to the Ethereum network.
- `POST /mintNft`: Mint a new NFT.
- `GET /getTokenByCitizenshipId/:citizenshipId`: Get token ID by citizenship ID.
- `GET /getTokenUriByCitizenshipId/:citizenshipId`: Get token URI by citizenship ID.

### File Upload

- `POST /upload`: Upload files to IPFS.

## Smart Contract

The smart contract is located in Citizenship.sol.

It uses OpenZeppelin's ERC721 implementation.

## Hardhat Configuration

The Hardhat configuration is located in hardhat.config.js.

## Verification

To verify the smart contract on Etherscan, use the verify.js.

## License

This project is licensed under the MIT License.
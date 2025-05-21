# Citizenship NFT Project

This project is a decentralized application (dApp) for minting and managing Citizenship NFTs. It leverages blockchain technology for secure, tamper-proof digital credentials, and provides a RESTful API for seamless integration and user interaction.

## Features
- Mint unique Citizenship NFTs on Ethereum
- Store metadata and images securely on IPFS via Pinata
- RESTful API for minting, querying, and file uploads
- Modular architecture with clear separation between blockchain and server logic

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

## Blockchain Component
The blockchain component is built with Hardhat and Solidity. It includes smart contracts that define the logic for Citizenship NFTs, using OpenZeppelin's ERC721 standard for security and interoperability.

- **Smart Contract**: `blockchain/contracts/Citizenship.sol` defines the NFT logic, including minting and metadata management.
- **Deployment**: Scripts in `blockchain/deploy/` automate contract deployment to Ethereum networks (e.g., Sepolia, localhost).
- **Configuration**: `hardhat.config.js` manages network settings and plugins.
- **Utilities**: Scripts in `blockchain/utils/` handle tasks like uploading to Pinata and contract verification.

### Common Commands
- Compile contracts: `npx hardhat compile`
- Deploy contracts: `npx hardhat deploy --network <network-name>`

## Server Component
The server is built with Express.js and acts as a bridge between users/applications and the blockchain. It exposes RESTful endpoints for NFT operations and file uploads.

- **Entry Point**: `server/index.js` starts the Express server and sets up routes.
- **Routes**: Defined in `server/routes/`, including:
  - `smartContractRoute.js`: Handles blockchain-related API calls
  - `uploadRoute.js`: Handles file uploads to IPFS via Pinata
- **Controllers**: Business logic for each route is in `server/controllers/`.
- **Middleware**: Includes file upload handling (Multer) and Pinata integration.
- **Config**: `server/config/constants.js` stores configuration values.

### API Endpoints
#### Smart Contract Interactions
- `GET /connect` — Connect to the Ethereum network
- `POST /mintNft` — Mint a new Citizenship NFT (requires metadata and image)
- `GET /getTokenByCitizenshipId/:citizenshipId` — Retrieve token ID by citizenship ID
- `GET /getTokenUriByCitizenshipId/:citizenshipId` — Retrieve token URI by citizenship ID

#### File Upload
- `POST /upload` — Upload files (e.g., images, documents) to IPFS via Pinata

### How it Works
1. **Minting**: Client sends a POST request to `/mintNft` with required data. The server uploads files to IPFS, stores metadata, and interacts with the smart contract to mint the NFT.
2. **Querying**: Endpoints allow retrieval of NFT details using citizenship ID.
3. **File Upload**: Files are uploaded to IPFS and their hashes are returned for use in NFT metadata.

### Running the Server
```bash
cd server
node index.js
```
The server runs on `http://localhost:3000` by default.

## License
This project is licensed under the MIT License.
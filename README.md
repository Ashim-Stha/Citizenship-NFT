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

3. Create a `.env` file in both `blockchain` and `server` directories with the following variables:

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

- **Smart Contract**: `blockchain/contracts/Citizenship.sol` defines the NFT logic, including minting and metadata management. This contract ensures each citizenship ID can only be minted once, and provides functions to retrieve token IDs and URIs by citizenship ID.
- **Deployment**: Scripts in `blockchain/deploy/` automate contract deployment to Ethereum networks (e.g., Sepolia, localhost). The deployment script also handles contract verification on Etherscan if the API key is provided.
- **Configuration**: `hardhat.config.js` manages network settings, Solidity compiler versions, named accounts, and plugins for gas reporting and contract verification.
- **Utilities**: Scripts in `blockchain/utils/` handle tasks like uploading images and metadata to Pinata (IPFS), and contract verification.

### Common Commands
- Compile contracts: `npx hardhat compile`
- Deploy contracts: `npx hardhat deploy --network <network-name>`
- Lint contracts: `npm run lint`
- Format code: `npm run format`

## Server Component
The server is built with Express.js and acts as a bridge between users/applications and the blockchain. It exposes RESTful endpoints for NFT operations and file uploads, and integrates with OCR and hardware (e.g., Arduino) for document automation.

- **Entry Point**: `server/index.js` starts the Express server, sets up routes, manages file uploads, OCR processing, and hardware communication.
- **Routes**: Defined in `server/routes/`, including:
  - `smartContractRoute.js`: Handles blockchain-related API calls (connect, mint, query)
  - `uploadRoute.js`: Handles file uploads to IPFS via Pinata
- **Controllers**: Business logic for each route is in `server/controllers/` (e.g., contract interaction, upload and metadata handling).
- **Middleware**: Includes file upload handling (Multer), Pinata integration, and image processing.
- **Config**: `server/config/constants.js` stores contract ABI and address for blockchain interaction.
- **OCR & Hardware**: Integrates with external OCR services and Arduino via WebSocket and SerialPort for automated document scanning and processing.

### API Endpoints
#### Smart Contract Interactions
- `GET /connect` — Connect to the Ethereum network and return the wallet address
- `POST /mintNft` — Mint a new Citizenship NFT (requires metadata and image)
- `GET /getTokenByCitizenshipId/:citizenshipId` — Retrieve token ID by citizenship ID
- `GET /getTokenUriByCitizenshipId/:citizenshipId` — Retrieve token URI by citizenship ID

#### File Upload
- `POST /upload` — Upload files (e.g., images, documents) to IPFS via Pinata

### How it Works
1. **Minting**: Client sends a POST request to `/mintNft` with required data. The server uploads files to IPFS, stores metadata, and interacts with the smart contract to mint the NFT.
2. **Querying**: Endpoints allow retrieval of NFT details using citizenship ID.
3. **File Upload**: Files are uploaded to IPFS and their hashes are returned for use in NFT metadata.
4. **OCR & Hardware**: Images can be processed via OCR and document handling can be automated using Arduino integration.

### Running the Server
```bash
cd server
node index.js
```
The server runs on `http://localhost:3000` by default.

## User Interface (UI)
The project includes a web-based UI provided in `index.html`. This interface allows users to:

- Capture document images (front and back) using their webcam.
- Upload images to the backend for processing and NFT minting.
- Control the document scanning workflow (capture, upload, stop, resume).
- View server responses and copy extracted text.

The UI communicates with the backend via HTTP requests and WebSocket for real-time updates (such as signals from Arduino hardware). It provides a user-friendly way to interact with the NFT minting process and document management features.

### How to Use the UI
1. Open `index.html` in your browser.
2. Use the provided buttons to capture and upload document images.
3. Monitor responses and workflow status directly in the browser.

## License
This project is licensed under the MIT License.
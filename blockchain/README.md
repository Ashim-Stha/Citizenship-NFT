
# Citizenship NFT

This project is a Citizenship NFT smart contract deployment and verification using Hardhat. It includes scripts for deploying the contract, verifying it on Etherscan, and uploading files to IPFS using Pinata.

## Project Structure

```
.env
artifacts/
cache/
contracts/
deploy/
deployments/


hardhat.config.js




helper-hardhat-config.js


images/


package.json


utils/
```

### Key Files and Directories

- `contracts/`: Contains the Solidity smart contracts.
  - `Citizenship.sol`: The main Citizenship NFT contract.
- `deploy/`: Deployment scripts.
  - `00-deploy-citizenship.js`: Script to deploy the Citizenship contract.
- `utils/`: Utility scripts.
  - `verify.js`: Script to verify the contract on Etherscan.
  - `uploadPinata.js`: Script to upload files to Pinata.
  - `uploadToPinata.js`: Script to upload files and metadata to Pinata.
- `hardhat.config.js`: Hardhat configuration file.
- `package.json`: Project dependencies and scripts.

## Getting Started

### Prerequisites

- Node.js
- npm
- Hardhat
- Etherscan API Key
- Pinata API Key and Secret

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/citizenship-nft.git
   cd citizenship-nft
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a 

.env

 file and add the following environment variables:
   ```
   SEPOLIA_RPC_URL=<your-sepolia-rpc-url>
   PRIVATE_KEY=<your-private-key>
   ETHERSCAN_API_KEY=<your-etherscan-api-key>
   PINATA_API_KEY=<your-pinata-api-key>
   PINATA_API_SECRET=<your-pinata-api-secret>
   ```

### Deployment

To deploy the Citizenship contract, run the following command:
```sh
npx hardhat deploy --network sepolia
```

### Verification

The contract verification is handled automatically in the deployment script if the network is not a development chain and the Etherscan API key is provided. You can also manually verify the contract using the 

verify

 function in 

verify.js

.

### Uploading to Pinata

To upload images to Pinata, use the 

storeImages

 function in 

uploadToPinata.js

:
```js
const { storeImages } = require("./utils/uploadToPinata");
storeImages("./path/to/images");
```

To upload metadata to Pinata, use the 

storeTokenUriMetadata

 function in 

uploadToPinata.js

:
```js
const { storeTokenUriMetadata } = require("./utils/uploadToPinata");
storeTokenUriMetadata(metadata);
```

## License

This project is licensed under the MIT License.

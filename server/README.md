

# NFT Minting and Uploading Service

This project is an NFT minting and uploading service built with Node.js, Express, and Ethers.js. It allows users to upload images, store them on IPFS via Pinata, and interact with a smart contract to mint NFTs.

## Project Structure

```
.env
config/
  constants.js
controllers/
  interactSmartContract.js
  uploadController.js
index.js
middleware/
  multer.js
  uploadToPinata.js
package.json
routes/
  smartContractRoute.js
  uploadRoute.js
uploads/
```

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:
   ```sh
   npm install
   ```

3. Create a 

.env

 file in the root directory and add the following environment variables:
   ```
   RPC_URL_ALCHEMY=<your-alchemy-rpc-url>
   PRIVATE_KEY=<your-private-key>
   ETHERSCAN_API_KEY=<your-etherscan-api-key>
   PINATA_API_KEY=<your-pinata-api-key>
   PINATA_API_SECRET=<your-pinata-api-secret>
   ```

## Usage

1. Start the server:
   ```sh
   node index.js
   ```

2. The server will be running on `http://localhost:3000`.

### Endpoints

#### Upload Route

- **POST /upload**
  - Uploads images and stores them on IPFS via Pinata.
  - Request: `multipart/form-data` with fields `front` and `back`.

#### Smart Contract Route

- **GET /connect**
  - Connects to the Ethereum network and returns the wallet address.

- **POST /mintNft**
  - Mints an NFT with the provided 

tokenUri

 and 

citizenshipId

.
  - Request: `application/json` with body `{ "tokenUri": "<token-uri>", "citizenshipId": "<citizenship-id>" }`.

- **GET /getTokenByCitizenshipId/:citizenshipId**
  - Retrieves the token ID associated with the provided 

citizenshipId

.

- **GET /getTokenUriByCitizenshipId/:citizenshipId**
  - Retrieves the token URI associated with the provided 

citizenshipId

.

## Project Files

- 

index.js

: Entry point of the application.
- 

constants.js

: Contains the ABI and contract address.
- 

uploadController.js

: Handles file uploads and metadata storage.
- 

interactSmartContract.js

: Handles interactions with the smart contract.
- 

uploadRoute.js

: Defines the upload route.
- 

smartContractRoute.js

: Defines the smart contract interaction routes.
- 

multer.js

: Configures Multer for file uploads.
- 

uploadToPinata.js

: Handles uploading files and metadata to Pinata.

## Dependencies

- `dotenv`: Loads environment variables from a 

.env

 file.
- 

ethers

: A library for interacting with the Ethereum blockchain.
- 

express

: A web framework for Node.js.
- 

multer

: A middleware for handling `multipart/form-data` for file uploads.
- `@pinata/sdk`: A library for interacting with the Pinata API.

## License

This project is licensed under the ISC License.

---

Feel free to customize this README file to better suit your needs.
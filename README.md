# Decentralized Voting Application

This is a demo application that implements a decentralized voting system using Solidity smart contracts and ReactJS. The application is deployed on the **Ethereum blockchain (Volta Testnet)** and interacts with **MetaMask** for user authentication.

## Features
- Ethereum blockchain-based voting system
- Smart contract deployment using Hardhat
- Truffle integration for development and testing
- MetaMask wallet authentication
- Uses the **Volta Testnet** for transactions

## Tech Stack
- **Frontend:** ReactJS, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Blockchain:** Solidity, Hardhat, Truffle
- **Authentication:** MetaMask
- **Database:** IPFS (optional for storing votes securely)

## Installation

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (LTS version recommended)
- **Hardhat** (`npm install --save-dev hardhat`)
- **Truffle** (`npm install -g truffle`)
- **MetaMask** browser extension
- **Ethereum Volta Testnet Account** (for testing)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/voting-app.git
   cd voting-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Smart Contract Deployment

You need to compile and deploy the contract to the blockchain network:

```sh
npx hardhat compile
npx hardhat run --network volta scripts/deploy.js
```

After deployment, copy the contract address and paste it into your `.env` file.

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```sh
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address
VOLTA_RPC_URL=https://volta-rpc.energyweb.org
```

### Running the Application

Once the contract is deployed and environment variables are set, start the application:

```sh
npm start
```

### MetaMask Configuration

To connect the application to Volta Testnet, follow these steps:

1. Open MetaMask and go to Settings.
2. Click Networks → Add Network.
3. Enter the following details:
   - **Network Name:** Volta Testnet
   - **New RPC URL:** https://volta-rpc.energyweb.org
   - **Chain ID:** 73799
   - **Currency Symbol:** VLT
   - **Block Explorer URL:** https://volta-explorer.energyweb.org/
4. Save the network and switch to Volta Testnet.
5. Import your Ethereum test account using the private key (not recommended for production).

### Testing with Truffle

To run tests using Truffle, execute:

```sh
truffle test
```

## Contributing

### How to Contribute

1. **Fork the Repository:** Click the "Fork" button on GitHub.
2. **Clone the Repository:** Download your forked repo to your local machine.
   ```sh
   git clone https://github.com/your-username/voting-app.git
   ```
3. **Create a New Branch:** Use a descriptive branch name.
   ```sh
   git checkout -b feature-name
   ```
4. **Make Changes:** Implement your feature or fix.
5. **Test Your Code:** Ensure all functionalities work correctly.
   ```sh
   npm test
   ```
6. **Commit Changes:** Follow commit message best practices.
   ```sh
   git commit -m "Add feature: New voting system"
   ```
7. **Push to GitHub:** Push the changes to your repository.
   ```sh
   git push origin feature-name
   ```
8. **Submit a Pull Request:** Go to GitHub and create a pull request.

### Contribution Guidelines

- Follow best coding practices.
- Use meaningful commit messages.
- Ensure all tests pass before submitting.
- Discuss major changes in issues before implementing them.

### Reporting Issues

If you find any bugs, report them in the Issues section.

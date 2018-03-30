const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('Web3');
const compiledFactory = require('./build/CampaignFactory.json'); //ABI=interface for web3 -Ethereum code= bytecode

const provider = new HDWalletProvider(
	'mom cause weekend slight twin toy swap shadow core rule payment later', // Obtained from MetaMask when a new user account is created
	'https://rinkeby.infura.io/Pq2fD7W38PK3alrIp3aU' // Copy from the email sent by Infura
);

const web3 = new Web3(provider);

let accounts;
let inbox;

const deploy = async () => {
	// We need to create a function to use async
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts(); // eth - ethereum contracts

	console.log('Attempting to deploy from account', accounts[0]);

	// Use one of those accounts to deploy
	// the contract
	inbox = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // Teaches web3 about what methods the contract has
		.deploy({ data: compiledFactory.bytecode }) // Tells web3 that we want to deploy a copy of this contract: We don´t need to initialize the contract with any value
		.send({ from: accounts[0], gas: '1000000' }); // Instructs web3 to send out a transactions that creates this contract: We use the first account

	console.log('Contract deployed to', inbox.options.address);
};
deploy();

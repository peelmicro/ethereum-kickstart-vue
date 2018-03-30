const assert = require('assert');
const ganache = require('ganache-cli'); // Local test network
const Web3 = require('Web3'); // It's in uppercase because it's a constructor

const provider = ganache.provider(); // ganache provider
const web3 = new Web3(provider); // Instance of Web3 using the ganache provider

const compiledFactory = require('../ethereum/build/CampaignFactory.json'); //ABI=interface for web3 -Ethereum code= bytecode
const compiledCampaign = require('../ethereum/build/Campaign.json'); //ABI=interface for web3 -Ethereum code= bytecode

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts(); // eth - ethereum contracts ==> ganache creates 10 unlocked (it can be used) by default

	// Use one of those accounts to deploy
	// the contract
	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // Teaches web3 about what methods the contract has
		.deploy({ data: compiledFactory.bytecode }) // Tells web3 that we want to deploy a copy of this contract: We don´t need to initialize the contract
		.send({ from: accounts[0], gas: '1000000' }); // Instructs web3 to send out a transactions that creates this contract: We use the first account

	// This code is needed only because of beta release .26 of web3 has a bug
	factory.setProvider(provider);

	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000'
	});

	// ES2016 - Get the first element of the array and put it in campaignAddress
	[ campaignAddress ] = await factory.methods.getDeployedCampaigns().call();

	campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaigns', () => {
	it('deploys a factory and a campaing', () => {
		assert.ok(factory.options.address); // ok=it has a defined value
		assert.ok(campaign.options.address); // ok=it has a defined value
	});

	it('marks caller as the campaign manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it('allows people to contribute money and marks them as approvers', async () => {
		await campaign.methods.contribute().send({
			value: 200,
			from: accounts[1]
		});
		const isContributor = await campaign.methods.approvers(accounts[1]).call();
		assert(isContributor);
	});

	it('requires a minimum contribution', async () => {
		const minimumContribution = await campaign.methods.minimumContribution().call();
		try {
			await campaign.methods.contribute().send({
				value: parseInt(minimumContribution) - 1,
				from: accounts[1]
			});
			assert(false);
		} catch (error) {
			assert(error);
		}
	});

	it('allows a manager to make a payment request', async () => {
		const description = 'Buy batteries';
		const value = '100';
		await campaign.methods.createRequest(description, value, accounts[1]).send({
			from: accounts[0],
			gas: '1000000'
		});

		const request = await campaign.methods.requests(0).call(); // 0 = first request

		assert.equal(description, request.description);
		assert.equal(value, request.value);
		assert.equal(accounts[1], request.recipient);
	});

	it('processes request', async () => {
		await campaign.methods.contribute().send({
			value: web3.utils.toWei('10', 'ether'),
			from: accounts[0]
		});

		const description = 'Buy batteries';
		await campaign.methods.createRequest(description, web3.utils.toWei('5', 'ether'), accounts[1]).send({
			from: accounts[0],
			gas: '1000000'
		});

		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		});

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		});

		let balance = await web3.eth.getBalance(accounts[1]);
		balance = web3.utils.fromWei(balance, 'ether');
		balance = parseFloat(balance);
		assert(balance > 104); // Initial balance is almost 100 + 5 then must be bigger than 104
	});
});

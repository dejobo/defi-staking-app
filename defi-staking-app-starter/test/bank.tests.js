const { assert } = require("chai");

const Tether = artifacts.require('Tether');
const Bank = artifacts.require('Bank');
const JavuToken = artifacts.require('JavuToken');

contract("Bank", accounts => {
    let tether, javu, bank;
    let owner = accounts[0];
    let customer = accounts[1];
    let customer2 = accounts[2];

    function token(amount) {
        return web3.utils.toWei(amount, 'ether');
    }

    before(async () => {
        javu = await JavuToken.new(/*total supply*/'10000000000000000000000000',
            /*name*/'Javu Token', /*decimal places*/ 18, /*symbol*/ 'JAVU');
        tether = await Tether.new();
        bank = await Bank.new(tether.address, javu.address);
    });

    describe("Mock Tether Deployment", async () => {
        it('Name matches successfully', async () => {
            //const tether = await Tether.deployed();
            const name = await tether.name();
            assert.equal(name, 'Mocked Tether Token');
        });

        it('Transfer 100 mock tether to customer successfully', async () => {
            //const tether = await Tether.deployed();
            await tether.transfer(customer, token('100'));
            let bal = await tether.getBalance(customer);
            assert.equal(bal, token('100'));
        });
    });

    describe("Javu Token Deployment", async () => {
        it('Name matches successfully', async () => {
            //const javu = await JavuToken.deployed();
            const name = await javu.name();
            assert.equal(name, 'Javu Token');
        });

        it('bank should have 0 Javu token', async () => {
            //const javu = await JavuToken.deployed();
            //const bank = await Bank.deployed();
            const balance = await javu.balanceOf(bank.address);
            assert.equal(balance, '0');
        });

        it('Should send 1 million javu token to bank', async () => {
            //const javu = await JavuToken.deployed();
            //const bank = await Bank.deployed();
            await javu.transfer(bank.address, token('1000000'));
            const balance = await javu.balanceOf(bank.address);
            assert.equal(balance, token('1000000'));
        });
    });

    describe("Bank Deployment", async () => {
        it('Name matches successfully', async () => {
            // const bank = await Bank.deployed();
            const name = await bank.name();
            assert.equal(name, 'Bank of Crypto');
        });

        it('Bank has tokens', async () => {
            // const bank = await Bank.deployed();
            let balance = await javu.balanceOf(bank.address);
            assert.equal(balance, token('1000000'));
        });
    });

    describe("Staking and Yielding", async () => {
        it("Customer can deposit tether successfully", async () => {
            let result;

            //check customer/investor balance
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), token('100'), 'customer balance before staking');

            //check customer staking
            await tether.approve(bank.address, token('100'), { from: customer });
            await bank.depositToken(token('100'), { from: customer });

            //check customer/investor balance after staking
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), token('0'), 'customer balance after staking');

            // check bank tether balance after staking
            const bankBalance = await tether.balanceOf(bank.address);
            assert.equal(bankBalance, token('100'), 'bank balance after customer staked');

            // check update customer javu balance
            const balance = await javu.balanceOf(customer);
            assert.equal(balance, token('0'), 'customer mock javu token balance');

            //is staking?
            const isStaking = await bank.isStaking(customer);
            assert.equal(isStaking, true);

            // issue token to customers
            await bank.issueToken({ from: owner });

            // get new balance of customer
            let newBal = await javu.balanceOf(customer);
            assert.equal(newBal.toString(), token('10'));

            // check customer balance in bank
            const customerBalance = await bank.customerBalance(customer);
            assert.equal(customerBalance, token('100'), 'customer balance in bank');

            // unstake customer balance
            await bank.unstakeToken({ from: customer });

            //check customer/investor balance
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), token('100'), 'customer balance after unstaking');

        });

    });
})
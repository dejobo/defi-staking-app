const Tether = artifacts.require('Tether');
const Bank = artifacts.require('Bank');
const JavuToken = artifacts.require('JavuToken');

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    await deployer.deploy(JavuToken, '10000000000000000000000000', 'Javu Token', 18, 'JAVU');
    const javuToken = await JavuToken.deployed();

    await deployer.deploy(Bank, tether.address, javuToken.address);
    const bank = await Bank.deployed();

    // transfer init coins
    await tether.transfer(bank.address, '1000000000000000000');

    await javuToken.transfer(bank.address, '100000000000000000000000')
    //await javuToken.transferFrom(bank.address, accounts[1], '1000000')
}
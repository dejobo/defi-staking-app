const Bank = artifacts.require('Bank');

module.exports = async function issueToken(callback) {
    const bank = await Bank.deployed();
    await bank.issueToken();
    console.log("Token issued successfully");
    callback();
};
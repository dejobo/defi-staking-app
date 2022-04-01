import React, { Component } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import Tether from "../abis/Tether.json";
import JavuToken from "../abis/JavuToken.json";
import Bank from "../abis/Bank.json";

class App extends Component {

    async UNSAFE_componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if (window.ethereuem) {
            window.web3 = new Web3(window.web3);
            //Window.web3 = new Web3(Web3.givenProvider);
            await window.ethereuem.enable();
            console.log('ethereum web3 enabled');
        } else if (window.web3) {
            window.web3.currentProvider.enable();
            window.web3 = new Web3(window.web3.currentProvider);
            console.log('web3 provider enabled');
        } else {
            window.alert("No ethereum detected! Download metamask or your favorite web 3 plugin");
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({
            account: accounts[0]
        });

        const networkId = await web3.eth.net.getId();
        //load Tether, Javu and Bank contract
        const tetherData = Tether.networks[networkId];
        const javuTokenData = JavuToken.networks[networkId];
        const bankData = Bank.networks[networkId];

        if (tetherData && javuTokenData && bankData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();

            const javu = new web3.eth.Contract(JavuToken.abi, javuTokenData.address);
            let javuBalance = await javu.methods.balanceOf(this.state.account).call();

            const bank = new web3.eth.Contract(Bank.abi, bankData.address);
            let stakingBalance = await bank.methods.customerBalance(this.state.account).call();

            this.setState({
                tether: tether,
                javuToken: javu,
                bank: bank,
                tetherBalance: tetherBalance.toString(),
                javuBalance: javuBalance.toString(),
                stakingBalance: stakingBalance.toString(),
                loading: false
            });

            console.log('state', this.state);
        } else {
            window.alert("Error! Contract is not deployed. No network found");
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            tether: {},
            javuToken: {},
            bank: {},
            tetherBalance: '0',
            javuBalance: '0',
            stakingBalance: '0',
            loading: true
        };
    }

    stakeTokens = (amount) => {
        this.setState({ loading: true });
        this.state.tether.methods.approve(this.state.bank._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.state.bank.methods.depositToken(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
                this.setState({ loading: false });
            });
        });
    }

    unstakeTokens = () => {
        this.setState({ loading: true });
        this.state.bank.methods.unstakeToken().send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false });
        })
    }

    render() {
        return (
            <div className="site-header sticky-top py-1">
                <Navbar accountNumber={this.state.account} />
                <Main isLoading={this.state.loading}
                    stakingBalance={this.state.stakingBalance}
                    rewardBalance={this.state.javuBalance}
                    tetherBalance={this.state.tetherBalance}
                    stakeTokens={this.stakeTokens}
                    unstakeTokens={this.unstakeTokens} />
            </div>
        )
    }
}

export default App;
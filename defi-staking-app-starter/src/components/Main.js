import React, { Component } from "react";

class Main extends Component {

    constructor(props) {
        super(props);
        this.onDepositClick = this.onDepositClick.bind(this);
        this.onWithdrawClick = this.onWithdrawClick.bind(this);
    }

    onDepositClick(evt) {
        evt.preventDefault();
        let amount = this.textInput.value;
        amount = window.web3.utils.toWei(amount, 'Ether');
        this.props.stakeTokens(amount);
    }

    onWithdrawClick(evt) {
        evt.preventDefault();
        this.props.unstakeTokens();
    }

    render() {
        return (
            <div className="container" style={{ marginTop: 50 }}>
                {this.props.isLoading ?
                    <div className="d-flex justify-content-center">
                        <strong>Loading...</strong>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                    :
                    <div className="row">
                        <div className="col-6">
                            <ol className="list-group list-group-numbered">
                                <li className="list-group-item d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">Staking Balance</div>
                                        {window.web3.utils.fromWei(this.props.stakingBalance)}
                                    </div>
                                    <span className="badge bg-primary rounded-pill">USDT</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">Javu Token Reward</div>
                                        {window.web3.utils.fromWei(this.props.rewardBalance)}
                                    </div>
                                    <span className="badge bg-danger rounded-pill">JAVU</span>
                                </li>
                            </ol>
                        </div>
                        <div className="col-6">
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="amountInput" className="form-label float-right">Balance: {window.web3.utils.fromWei(this.props.tetherBalance)} USDT</label>
                                    <input type="text"
                                        ref={(input) => { this.textInput = input }}
                                        className="form-control"
                                        id="amountInput"
                                        placeholder="0" required />
                                </div>
                                <button className="btn btn-primary btn-block"
                                    onClick={this.onDepositClick}>
                                    Deposit
                                </button>
                                <button className="btn btn-primary btn-block"
                                    onClick={this.onWithdrawClick}>
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>}

            </div >
        )
    }
}

export default Main;
import React, { useState } from "react";
import { PropTypes } from "prop-types";

const Main = ({
    isLoading,
    stakingBalance,
    rewardBalance,
    tetherBalance,
    stakeTokens,
    unstakeTokens }) => {

    const [textInput, setTextInput] = useState('');

    const HandleChange = (e) => {
        setTextInput(e.target.value);
    }

    const onDepositClick = (e) => {
        e.preventDefault();
        let amount = textInput;
        amount = window.web3.utils.toWei(amount, 'Ether');
        stakeTokens(amount);
        setTextInput('');
    }

    const onWithdrawClick = (e) => {
        e.preventDefault();
        unstakeTokens();
    }

    return (
        <div className="container" style={{ marginTop: 50 }}>
            {isLoading ?
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
                                    {window.web3.utils.fromWei(stakingBalance)}
                                </div>
                                <span className="badge bg-primary rounded-pill">USDT</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">Javu Token Reward</div>
                                    {window.web3.utils.fromWei(rewardBalance)}
                                </div>
                                <span className="badge bg-danger rounded-pill">JAVU</span>
                            </li>
                        </ol>
                    </div>
                    <div className="col-6">
                        <div>
                            <div className="mb-3">
                                <label htmlFor="amountInput" className="form-label float-right">Balance: {window.web3.utils.fromWei(tetherBalance)} USDT</label>
                                <input type="text"
                                    value={textInput}
                                    onChange={HandleChange}
                                    className="form-control"
                                    id="amountInput"
                                    placeholder="0" required />
                            </div>
                            <button className="btn btn-primary btn-block"
                                disabled={!textInput}
                                onClick={onDepositClick}>
                                Deposit
                            </button>
                            <button className="btn btn-primary btn-block"
                                disabled={stakingBalance <= 0}
                                onClick={onWithdrawClick}>
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

Main.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    stakingBalance: PropTypes.string.isRequired,
    rewardBalance: PropTypes.string.isRequired,
    tetherBalance: PropTypes.string.isRequired,
    stakeTokens: PropTypes.func.isRequired,
    unstakeTokens: PropTypes.func.isRequired
};

export default Main;
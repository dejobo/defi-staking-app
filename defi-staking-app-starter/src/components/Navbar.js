import React from "react";
import bankImg from '../bank.png';

const Navbar = ({ accountNumber }) => {
    return (
        <nav className="p-6 navbar fixed-top shadow">
            <div className="shrink-0">
                <img width="50" height="50" className="h-12 w-12" src={bankImg} alt="bank" />
            </div>
            <a href="/">DAPP Yield Staking </a>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">Account Number: {accountNumber}</li>
            </ul>
        </nav>
    )
}

export default Navbar;
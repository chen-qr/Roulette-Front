import styles from '../styles/index.module.css'
import Web3 from 'web3'
import { Wallet } from './interface'
import React, { useState, useEffect } from 'react'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")

    useEffect(() => {

        async function name() {
            if (window.web3) {
                try {
                // get the user's ethereum account - prompts metamask to login
                const selectedAccount = await window.ethereum
                    .request({
                        method: "eth_requestAccounts",
                    })
                    .then((accounts) => accounts[0])
                    .catch(() => {
                    // if the user cancels the login prompt
                    throw Error("Please select an account");
                    });
        
                // set the global userWalletAddress variable to selected account
                setWalletAddress(selectedAccount);
        
                // store the user's wallet address in local storage
                window.localStorage.setItem("userWalletAddress", selectedAccount);
        
                } catch (error) {
                alert(error);
                }
            } else {
                alert("wallet not found");
            }
        }
        name()
    })

    return (
    <div>
        <div>
            <div>连接钱包</div>
            <div>Address: {walletAddress}</div>
        </div>
    </div>
    );
}

export async function getStaticProps() {
    return {
        props: {
            wallet: {
                address: "1234",
            }
        }
    }
}

export default index
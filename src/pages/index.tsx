import styles from '../styles/index.module.css'
import Web3 from 'web3'
import { Wallet } from './interface'
import React, { useState, useEffect } from 'react'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")

    useEffect(() => {
        setWalletAddress(window.localStorage.getItem("userWalletAddress"))
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
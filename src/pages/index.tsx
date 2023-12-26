import styles from '../styles/index.module.css'
import Web3 from 'web3'
import { Wallet } from './interface'
import React, { useState, useEffect } from 'react'
import {initWalletAddress} from '../lib/wallet'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")

    useEffect(() => {
        initWalletAddress(setWalletAddress)
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

export default index
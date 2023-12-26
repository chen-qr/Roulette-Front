import Head from 'next/head'
import Script from 'next/script'
import styles from '../styles/index.module.css'
import Web3 from 'web3'
import { Wallet } from './interface'
import React, { useState, useEffect } from 'react'
import {initWalletAddress} from '../lib/Wallet'
import {initPlayerScore} from '../lib/RouletteGame/client'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")
    useEffect(() => { initWalletAddress(setWalletAddress) })

    const [playerScore, setPlayerScore] = useState("")
    useEffect(() => { 
        if (walletAddress != undefined && walletAddress != "") { initPlayerScore(walletAddress, setPlayerScore) }
    })

    return (
    <div>
        <Head>
            <Script src="/web3.js" />
        </Head>
        <div>
            <div>连接钱包</div>
            <div>Address: {walletAddress}</div>
        </div>
        <div>
            <div>Player Score: {playerScore}</div>
        </div>
    </div>
    );
}

export default index
import Head from 'next/head'
import Script from 'next/script'
import styles from '../styles/index.module.css'
import React, { useState, useEffect } from 'react'
import {initWalletAddress} from '../lib/Wallet'
import {initPlayerScore, deposit} from '../lib/RouletteGame/client'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")
    useEffect(() => { initWalletAddress(setWalletAddress) })

    const [playerScore, setPlayerScore] = useState(0)
    useEffect(() => { 
        if (walletAddress != undefined && walletAddress != "") { initPlayerScore(walletAddress, setPlayerScore) }
    }, [walletAddress])

    // deposit amount
    const [depositAmount, setDepositAmount] = useState(0)
    const handleDepositAmountChange = (event) => { setDepositAmount(event.target.value) }   

    // deposit click
    const handleDepositClick = () =>{
        console.log("deposit click", depositAmount)
        deposit(walletAddress, depositAmount)
    };

    return (
    <div>
        <Head>
            <Script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js" />
        </Head>
        <div>
            <div>连接钱包</div>
            <div>Address: {walletAddress}</div>
        </div>
        <div>
            <div>Player Score: {playerScore}</div>
        </div>
        <hr />
        <div>
            <input type="number" value={depositAmount} onChange={handleDepositAmountChange}/>
            <button type="button" onClick={handleDepositClick}>deposit</button>
        </div>
        <div>
            <input type="number"/>
            <button type="button">withdraw</button>
        </div>
        <hr />
        <div>
            <div>
                <div>Bet Number</div>
                <input type="number"/>
            </div>
            <div>
                <div>Bet Amount</div>
                <input type="number"/>
            </div>
        </div>
        <div>
            <button type="button">Bet</button>
            <div></div>
        </div>
        <div>
            <button type="button">Drawing</button>
        </div>
        <hr />
    </div>
    );
}

export default index
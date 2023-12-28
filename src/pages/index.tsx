import Head from 'next/head'
import Script from 'next/script'
import styles from './styles.module.css'
import React, { useState, useEffect } from 'react'
import {initWalletAddress} from '../lib/Wallet'
import {initPlayerScore, deposit, withdraw, betAction, drawingAction} from '../lib/RouletteGame/client'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")
    useEffect(() => { initWalletAddress(setWalletAddress) })

    const [logSuggest, setLogSuggest] = useState("Login")
    useEffect(() => { 
        if (walletAddress != undefined && walletAddress != "") { setLogSuggest("Logout") }
    }, [walletAddress])

    const [playerScore, setPlayerScore] = useState(0)
    useEffect(() => { 
        if (walletAddress != undefined && walletAddress != "") { initPlayerScore(walletAddress, setPlayerScore) }
    }, [walletAddress])
    const onPlayerScoreChange = () => { initPlayerScore(walletAddress, setPlayerScore) }

    // deposit amount
    const [depositAmount, setDepositAmount] = useState(0)
    const handleDepositAmountChange = (event) => { setDepositAmount(event.target.value) }   
    // withdraw amount
    const [withdrawAmount, setWithdrawAmount] = useState(0)
    const handleWithdrawAmountChange = (event) => { setWithdrawAmount(event.target.value) }   
    // bet number
    const [betNumber, setBetNumber] = useState(0)
    const handleBetNumberChange = (event) => { setBetNumber(event.target.value) }
    // bet amount
    const [betAmount, setBetAmount] = useState(0)
    const handleBetAmountChange = (event) => { setBetAmount(event.target.value) }

    // deposit click
    const handleDepositClick = () =>{
        deposit(walletAddress, depositAmount)
        onPlayerScoreChange()
    };
    // withdraw click
    const handleWithdrawClick = () =>{
        withdraw(walletAddress, withdrawAmount, playerScore)
        onPlayerScoreChange()
    };
    // bet click
    const handleBetClick = () =>{
        betAction(walletAddress, betNumber, betAmount, playerScore)
    };
    // drawing click
    const handleDrawingClick = () =>{
        drawingAction(walletAddress)
    };

    return (
    <div>
        <Head>
            <Script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js" />
        </Head>
        <div>
            <button>{logSuggest}</button>
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
            <input type="number" value={withdrawAmount} onChange={handleWithdrawAmountChange}/>
            <button type="button" onClick={handleWithdrawClick}>withdraw</button>
        </div>
        <hr />
        <div>
            <div>
                <div>Bet Number</div>
                <input type="number" value={betNumber} onChange={handleBetNumberChange}/>
            </div>
            <div>
                <div>Bet Amount</div>
                <input type="number" value={betAmount} onChange={handleBetAmountChange}/>
            </div>
        </div>
        <div>
            <button type="button" onClick={handleBetClick}>Bet</button>
            <div></div>
        </div>
        <div>
            <button type="button" onClick={handleDrawingClick}>Drawing</button>
        </div>
        <hr />
        <div>
            <div>
                <div className={styles.betNumberAreaBlack}>
                    <div className={styles.betText}>
                        1
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default index
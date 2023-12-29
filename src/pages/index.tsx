import Head from 'next/head'
import Script from 'next/script'
import React, { useState, useEffect } from 'react'
import {initWalletAddress} from '../lib/Wallet'
import {initPlayerScore, deposit, withdraw, betAction, drawingAction} from '../lib/RouletteGame/client'
import WalletConnect from '../components/WalletConnect/Layout'
import PlayerScore from '../components/PlayerScore/Layout'
import BetArea from '../components/BetArea/Layout'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")
    useEffect(() => { initWalletAddress(setWalletAddress) })

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

    const onNumberClick = (number) => {
        setBetNumber(number)
    }

    return (
    <div>
        <Head>
            <Script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js" />
        </Head>
        <WalletConnect walletAddress={walletAddress}/>
        <PlayerScore playerScore={playerScore}/>
        <div>
            <input type="number" value={depositAmount} onChange={handleDepositAmountChange}/>
            <button type="button" onClick={handleDepositClick}>deposit</button>
        </div>
        <div>
            <input type="number" value={withdrawAmount} onChange={handleWithdrawAmountChange}/>
            <button type="button" onClick={handleWithdrawClick}>withdraw</button>
        </div>
        <BetArea beginNum={1} endNum={36} lineCnt={3} onNumberClick={onNumberClick} playerScore={playerScore}/>
    </div>
    );
}

export default index
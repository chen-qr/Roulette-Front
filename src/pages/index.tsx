import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import {initWalletAddress} from '../lib/Wallet'
import {initPlayerScore, deposit, withdraw, betAction, drawingAction, getDrawingRecord} from '../lib/RouletteGame/client'
import WalletConnect from '../components/WalletConnect/Layout'
import PlayerScore from '../components/PlayerScore/Layout'
import BetArea from '../components/BetArea/Layout'
import DrawRecord from '../components/DrawRecord/Layout'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")
    const [playerScore, setPlayerScore] = useState(0)
    const [canDrawRecordQuery, setCanDrawRecordQuery] = useState(false)

    useEffect(() => { initWalletAddress(setWalletAddress) })
    useEffect(() => { 
        if (walletAddress != undefined && walletAddress != "") { 
            initPlayerScore(walletAddress, setPlayerScore) 
            setCanDrawRecordQuery(true) // 余额更新之后，就可以更新开奖记录了
        }
    }, [walletAddress])
    const onPlayerScoreChange = () => { initPlayerScore(walletAddress, setPlayerScore) }

    // deposit click
    const handleDepositClick = (depositAmount) =>{
        deposit(walletAddress, depositAmount)
        onPlayerScoreChange()
    };
    // withdraw click
    const handleWithdrawClick = (withdrawAmount) =>{
        withdraw(walletAddress, withdrawAmount, playerScore)
        onPlayerScoreChange()
    };
    // bet click
    const handleOnBetAction = (selectedNumber, betAmount, handleOnBetFinish) =>{
        betAction(walletAddress, selectedNumber, betAmount, playerScore, handleOnBetFinish)
    };
    // drawing click
    const handleDrawingClick = (selectedNumber, betAmount, userRandomNumber, sequenceNumber, handleOnDrawingFinish) =>{
        drawingAction(walletAddress, selectedNumber, betAmount, userRandomNumber, sequenceNumber, handleOnDrawingFinish)
    };

    const handleSaveBetResult = (selectedNumber, betAmount, userRandomNumber, commitment, sequenceNumber, providerRandom, finalRandomNumber, drawNumber, isWin) => {
        onPlayerScoreChange()
    }

    return (
    <div className={styles.main}>
        <div className={styles.title}>LightLink APAC Hackthoon - Chanllenge 1</div>
        <WalletConnect walletAddress={walletAddress}/>
        <PlayerScore playerScore={playerScore} onHandleDeposit={handleDepositClick} onHandleWithdraw={handleWithdrawClick}/>
        <BetArea beginNum={1} endNum={36} lineCnt={3} playerScore={playerScore}
            onBetAction={handleOnBetAction}
            onDwaringAction={handleDrawingClick}
            handleSaveBetResult={handleSaveBetResult}
            />
        <DrawRecord walletAddress={walletAddress} canQuery={canDrawRecordQuery}/>
    </div>
    );
}

export default index
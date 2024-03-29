import React, { useState, useEffect } from 'react'
import styles from './index.module.css'
import {initWalletAddress} from '../lib/Wallet'
import {initPlayerScore, deposit, withdraw, betAction, drawingAction} from '../lib/RouletteGame/client'
import WalletConnect from '../components/WalletConnect/Layout'
import PlayerScore from '../components/PlayerScore/Layout'
import BetArea from '../components/BetArea/Layout'
import DrawRecord from '../components/DrawRecord/Layout'

function index({}) {
    const [walletAddress, setWalletAddress] = useState("")
    const [playerScore, setPlayerScore] = useState(0)
    const [canDrawRecordQuery, setCanDrawRecordQuery] = useState(false)

    // 处理用户金额更新后事件
    const onContractBackUserScoreRefresh = (score: number) => {
        setPlayerScore(score)
        setCanDrawRecordQuery(true) // 余额更新之后，就可以更新开奖记录了
    }

    useEffect(() => { initWalletAddress(setWalletAddress) })
    useEffect(() => { 
        if (walletAddress != undefined && walletAddress != "") { 
            initPlayerScore(walletAddress, onContractBackUserScoreRefresh) 
        }
    }, [walletAddress])
    const onPlayerScoreChange = () => { initPlayerScore(walletAddress, onContractBackUserScoreRefresh) }

    const onClickDeposit = (depositAmount) =>{
        deposit(walletAddress, depositAmount)
        onPlayerScoreChange()
    };
    const onClickWithdraw = (withdrawAmount) =>{
        withdraw(walletAddress, withdrawAmount, playerScore)
        onPlayerScoreChange()
    };

    const handleSaveBetResult = (selectedNumber, betAmount, userRandomNumber, commitment, sequenceNumber, providerRandom, finalRandomNumber, drawNumber, isWin) => {
        onPlayerScoreChange()
    }

    return (
    <div className={styles.main}>
        <WalletConnect walletAddress={walletAddress}/>
        <PlayerScore playerScore={playerScore} onHandleDeposit={onClickDeposit} onHandleWithdraw={onClickWithdraw}/>
        <BetArea walletAddress={walletAddress} beginNum={1} endNum={36} lineCnt={3} playerScore={playerScore}
            handleSaveBetResult={handleSaveBetResult}
            />
        <DrawRecord walletAddress={walletAddress} canQuery={canDrawRecordQuery}/>
    </div>
    );
}

export default index
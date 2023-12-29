import React, { useState, useEffect } from 'react'
import styles from './Layout.module.css'


const PlayerScore = ({playerScore, onHandleDeposit, onHandleWithdraw}) => {
    const [isShowChangeAmountInput, setIsShowChangeAmountInput] = useState(false);
    const [changeType, setChangeType] = useState("");
    const [changeAmount, setChangeAmount] = useState("");

    let playerScoreText = "";
    let uintText = ""
    if (playerScore < 0) {
        playerScoreText = "waiting..."
        uintText = ""
    } else {
        playerScoreText = playerScore.toLocaleString()
        let ethAmount = playerScore / 1000000000000000000
        uintText = `wei = ${ethAmount} eth`
    }

    const onHandleDepositClick = () => {
        setIsShowChangeAmountInput(true)
        setChangeType("deposit")
    }

    const onHandleWithdrawClick = () => {
        setIsShowChangeAmountInput(true)
        setChangeType("withdraw")
    }

    const onHandleInput = (event) => {
        setChangeAmount(event.target.value)
    }

    const onHandleSubmit = () => {
        if (changeType === "deposit") {
            onHandleDeposit(changeAmount)
        } else if (changeType === "withdraw") {
            onHandleWithdraw(changeAmount)
        } else {
        }
    }

    const showAmountInput = () => {
        if (isShowChangeAmountInput) {
            return (
                <div style={{display: 'flex'}}>
                    <div style={{display: 'inline-block', marginLeft: 2}}>{changeType === "deposit" ? "Input deposit amount (must > 100000000)" : "Input withdraw amount (must <= balance)"}</div>
                    <input className={styles.changeScoreInput} type="number" onChange={onHandleInput}/>
                    <button style={{marginLeft: 2}} onClick={onHandleSubmit}>submit</button>
                </div>
                
            )
        }
    }

    return (
        <div className={styles.scoreBoard}>
            <div className={styles.balance}>Your balance in the contract</div>
            <div className={styles.balanceContent}>
                <div className={styles.scoreNumber}>{playerScoreText}</div>
                <div className={styles.scoreUint}>{uintText}</div>
            </div>
            <div className={styles.changeScore}>
                <button className={styles.deposit} type="button" onClick={onHandleDepositClick}>deposit</button> 
                <button className={styles.deposit} type="button" onClick={onHandleWithdrawClick}>withdraw</button> 
            </div>
            {showAmountInput()}
        </div>
    );    
    
}

export default PlayerScore;
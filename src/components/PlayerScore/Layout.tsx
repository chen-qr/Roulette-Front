import React, { useState, useEffect } from 'react'
import styles from './Layout.module.css'


const PlayerScore = ({playerScore}) => {

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

    return (
        <div className={styles.scoreBoard}>
            <div className={styles.balance}>Your balance:</div>
            <div className={styles.balanceContent}>
                <div className={styles.scoreNumber}>{playerScoreText}</div>
                <div className={styles.scoreUint}>{uintText}</div>
            </div>
            <div className={styles.changeScore}>
                <div>Click </div>
                <button className={styles.deposit} type="button">deposit</button> 
                <div>to deposit ETH to the contract and increase your balance. </div>
            </div>
            <div className={styles.changeScore}>
                <div>Click </div>
                <button className={styles.deposit} type="button">withdraw</button> 
                <div>to withdraw ETH from the contract and reduce your balance. </div>
            </div>

        </div>
    );    
    
}

export default PlayerScore;
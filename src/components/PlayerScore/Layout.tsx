import React, { useState, useEffect } from 'react'
import styles from './Layout.module.css'


const PlayerScore = ({playerScore}) => {

    let playerScoreText = "";
    if (playerScore <= 0) {
        playerScoreText = "waiting..."
    } else {
        playerScoreText = playerScore.toLocaleString()
    }

    return (
        <div className={styles.scoreBoard}>
            <div className={styles.balance}>Your balance</div>
            <div className={styles.scoreNumber}>{playerScoreText}</div>
        </div>
    );    
    
}

export default PlayerScore;
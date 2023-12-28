import React, { Component } from "react";
import styles from './Layout.module.css'

const BetNumberArea = ({color: string, number: number}) => {
    
    return (
        <div className={`${styles.betNumberArea} ${styles.araeRed}`}>
            <div className={styles.betText}>
                {number}
            </div>
        </div>
    );    
    
}

export default BetNumberArea;
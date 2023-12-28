import { useState } from 'react'
import styles from './Layout.module.css'

const BetAmount = ({}) => {
    return (
        <div className={styles.percentContain}>
            <div className={styles.percentProportion}></div>
            <span className={styles.percentBox}></span>
        </div>
    );
};

export default BetAmount;
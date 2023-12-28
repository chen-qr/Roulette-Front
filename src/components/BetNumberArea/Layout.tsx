import React, { Component } from "react";
import styles from './Layout.module.css'

class BetNumberArea extends Component {
    render(): React.ReactNode {
        return (
            <div className={`${styles.betNumberArea} ${styles.araeRed}`}>
                <div className={styles.betText}>
                    1
                </div>
            </div>
        );    
    }
}

export default BetNumberArea;
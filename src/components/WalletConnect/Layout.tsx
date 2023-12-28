import React, { useState, useEffect } from 'react'
import styles from './Layout.module.css'


const WalletConnect = ({walletAddress}) => {

    const isActive = walletAddress != undefined && walletAddress != "" ? true : false
    
    const [logSuggest, setLogSuggest] = useState("Please connect your wallet!")
    useEffect(() => { 
        if (isActive) { setLogSuggest("Wallet connected") }
    }, [walletAddress])
    
    const getActiveColor = () => { return isActive ? styles.logSuggestActive : styles.logSuggestInActive}

    return (
        <div>
            <div>
                <div className={`${styles.logSuggest} ${getActiveColor()}`}>{logSuggest}</div>
                <div>Address: {walletAddress}</div>
            </div>
        </div>
    );    
    
}

export default WalletConnect;
import React, { useState, useEffect } from 'react'
import styles from './Layout.module.css'


const WalletConnect = ({walletAddress}) => {
    
    const [logSuggest, setLogSuggest] = useState("Please connect your wallet!")
    useEffect(() => { 
        if (walletAddress != undefined && walletAddress != "") { setLogSuggest("Wallet connected") }
    }, [walletAddress])

    return (
        <div>
            <div>
                <div>{logSuggest}</div>
                <div>Address: {walletAddress}</div>
            </div>
        </div>
    );    
    
}

export default WalletConnect;
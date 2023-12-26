import styles from '../styles/index.module.css'
import Web3 from 'web3'
import { Wallet } from './interface'
import React, { useState } from 'react'

function index({}) {
    const [count, setCount] = useState(0)
    function increment() {
        setCount(count + 1)
    }

    return (
    <div>
        <div>
            <div>连接钱包</div>
            <div>Address:</div>
        </div>
        <div>
            <p>You clicked {count} times</p>
            <button onClick={increment}>Click me</button>
        </div>
    </div>
    );
}

export async function getStaticProps() {
    return {
        props: {
            wallet: {
                address: "1234",
            }
        }
    }
}

export default index
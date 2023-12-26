import styles from '../styles/index.module.css'
import Web3 from 'web3'
import { Wallet } from './interface'

function index({}) {
    return (
    <div>
        <div>连接钱包</div>
        <div>Address:</div>
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
import {contractAddress, abi} from './config'
import Web3 from "web3";

let rouletteGame = null;

function getContract(walletAddress: string) {
    if (rouletteGame == undefined || rouletteGame == null) {
        console.log("Initializing contract");
        const web3 = new Web3(window.ethereum);
        rouletteGame = new web3.eth.Contract(abi, contractAddress, {from: walletAddress});
    }
    return rouletteGame;
}

export async function initPlayerScore(walletAddress: string, setPlayerScore: Function) {
    const rouletteGame = getContract(walletAddress);
    const score = await rouletteGame.methods.getScore().call();
        setPlayerScore(parseInt(score))
}

export async function deposit(walletAddress: string, amount: number) {
    if (amount <= 100000000) {
        const errMsg = "deposit amount can not less than 100000000!";
        alert(errMsg);
        console.warn(errMsg);
        return;
    }

    await rouletteGame.methods
        .deposit()
        .send({from: walletAddress, value: amount});
};

export async function withdraw(walletAddress: string, amount: number, playerScore: number) {
    if (amount <= 0) {
        const errMsg = "withdraw amount can not less than 0!";
        alert(errMsg);
        console.warn(errMsg);
        return;
    };

    if (amount > playerScore) {
        const errMsg = `withdraw amount ${amount} can not larger than playerScore ${playerScore}!`;
        alert(errMsg);
        console.warn(errMsg);
        return;
    }

    await rouletteGame.methods
        .withdraw(walletAddress, amount)
        .send({from: walletAddress});
};
import {contractAddress, abi} from './config'

let rouletteGame = null;

function getContract(walletAddress: string) {
    if (rouletteGame == undefined || rouletteGame == null) {
        console.log("Initializing contract");
        // const web3 = new Web3(window.ethereum);
        // rouletteGame = new web3.eth.Contract(abi, contractAddress, {from: walletAddress});
        // 下面是浏览器的代码，从浏览器获取库
        const { Web3 } = require('web3');
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

    console.log("deposit", walletAddress, amount);
    if (amount < 100000000) {
        const errMsg = "deposit amount can not less than 100000000!";
        alert(errMsg);
        console.warn(errMsg);
        return;
    }

    // https://github.com/web3/web3.js/issues/4258
    await rouletteGame.methods
        .deposit()
        // .send({from: walletAddress, value: amount});
        .send({from: walletAddress, value: amount.toString, type: "0x0", method: 'personal_sign'});
};
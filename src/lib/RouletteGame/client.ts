import {contractAddress, abi} from './config'
import Web3 from "web3";

let rouletteGame = null;
let web3: Web3 = null;

function getContract(walletAddress: string) {
    if (rouletteGame == undefined || rouletteGame == null) {
        console.log("Initializing contract");
        web3 = new Web3(window.ethereum);
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

export async function betAction(walletAddress: string, betNumber: number, betAmount: number, playerScore: number) {

    if (betNumber <= 0 || betNumber > 12) {
        alert("Bet number must between 1 and 12!");
        return;
    }
    if (betAmount <= 0 || betAmount > playerScore) {
        alert("Bet amount must be greater than zero and smaller than player balance!");
        return;
    }

    const randomNumber = web3.utils.randomHex(32);
    const commitment = web3.utils.keccak256(randomNumber);

    console.log(`   number    : ${randomNumber}`);
    console.log(`   commitment: ${commitment}`);

    const flipFee = await rouletteGame.methods.getFlipFee().call();
    console.log(`   fee       : ${flipFee} wei`);

    const receipt = await rouletteGame.methods
        .makeBet(walletAddress, betAmount, betNumber, commitment)
        .send({ value: flipFee, from: walletAddress });

    const sequenceNumber = receipt.events.BetRequest.returnValues.sequenceNumber;
    console.log(`   sequence  : ${sequenceNumber}`);
    
    localStorage.betNumber = betNumber;
    localStorage.betAmount = betAmount;
    localStorage.userRandomNumber = randomNumber;
    localStorage.sequenceNumber = sequenceNumber;
};

export async function drawingAction(walletAddress: string) {
    if (localStorage.betNumber == 0 || localStorage.betAmount == 0 || localStorage.sequenceNumber == 0) {
        alert("You haven't bet yet! Please make a bet!");
        return;
    }

    const fortunaUrl = "https://fortuna-staging.pyth.network";
    const chainName = "lightlink_pegasus";
    const url = `${fortunaUrl}/v1/chains/${chainName}/revelations/${localStorage.sequenceNumber}`;
    const response = await fetch(url, {method: 'get'});
    let res = await response.json();
    const providerRandom = `0x${res.value.data}`;

    console.log(`   walletAddress  : ${walletAddress}`);
    console.log(`   sequenceNumber  : ${localStorage.sequenceNumber}`);
    console.log(`   userRandomNumber  : ${localStorage.userRandomNumber}`);
    console.log(`   provider  : ${providerRandom}`);
    const receipt = await rouletteGame.methods
        .drawing(walletAddress, 
            localStorage.sequenceNumber, 
            localStorage.userRandomNumber, 
            providerRandom)
        .send({ from: walletAddress });

    const randomNumber = receipt.events.DrawingRequest.returnValues.randomNumber;
    const drawNumber = receipt.events.DrawingRequest.returnValues.drawNumber;
    const isWin = receipt.events.DrawingRequest.returnValues.isWin;
    console.log(`   randomNumber  : ${randomNumber}`);
    console.log(`   drawNumber  : ${drawNumber}`);
    console.log(`   isWin  : ${isWin}`);
    
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = String(currentTime.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
    const day = String(currentTime.getDate()).padStart(2, '0');
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const result = {
        drawingTime: formattedTime,
        betNumber: localStorage.betNumber,
        betAmount: localStorage.betAmount,
        betResult: isWin ? "win" : "lose",
    };

    let betResults = JSON.parse(localStorage.getItem('betResults'));
    if (betResults == undefined || !Array.isArray(betResults) || betResults.length <= 0) {
        betResults= new Array(result);
    } else {
        betResults.push(result);
    }
    localStorage.setItem('betResults', JSON.stringify(betResults));
};
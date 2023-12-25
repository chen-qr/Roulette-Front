window.userWalletAddress = null;
let rouletteGame = null;
const contractAddress = "0xbe2c47f3DBD464240775AC5e5ae17c8386c2203c";
let playBalance = 0;
let betInfo = {};

window.onload = async (event) => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
    } else {
        alert("Please install MetaMask or any Ethereum Extension Wallet");
    }

    window.userWalletAddress = window.localStorage.getItem("userWalletAddress");
    showLoginStatus();
}

const showLoginStatus = async () => {
    if (!window.userWalletAddress) {
        document.querySelector(".walletLogin").innerHTML = "钱包未连接，请连接钱包";
        document.querySelector(".walletLogin").addEventListener("click", loginWithEth);
    } else {
        document.querySelector(".walletLogin").innerHTML = "Wallet connected!";
        document.querySelector(".walletAddress").innerHTML = window.userWalletAddress;
        createContract();
        showPlayerStatus();
    }
}

const loginWithEth = async () => {
    // check if there is global window.web3 instance
    if (window.web3) {
        try {
        // get the user's ethereum account - prompts metamask to login
        const selectedAccount = await window.ethereum
            .request({
            method: "eth_requestAccounts",
            })
            .then((accounts) => accounts[0])
            .catch(() => {
            // if the user cancels the login prompt
            throw Error("Please select an account");
            });

        // set the global userWalletAddress variable to selected account
        window.userWalletAddress = selectedAccount;

        // store the user's wallet address in local storage
        window.localStorage.setItem("userWalletAddress", selectedAccount);

        } catch (error) {
        alert(error);
        }
    } else {
        alert("wallet not found");
    }
};

const createContract = async () => {
    rouletteGame = new window.web3.eth.Contract(window.abi, contractAddress, {from: window.userWalletAddress});
}

const showPlayerStatus = async () => {
    playBalance = await rouletteGame.methods.getScore().call();
    console.log(playBalance);
    document.querySelector(".playAmount").innerHTML = playBalance;

    betInfo = await rouletteGame.methods.getBetInfo().call();
    if (betInfo.betNumber > 0 && betInfo.betAmount > 0 && localStorage.sequenceNumber == betInfo.sequenceNumber && localStorage.userRandomNumber > 0) {
        document.querySelector(".betShow").innerHTML = `You have bet (number: ${betInfo.betNumber}, amount: ${betInfo.betAmount})`;
    } else {
        document.querySelector(".betShow").innerHTML = `You haven't bet yet!`;
    }
    // 展示结果
    const betResults = JSON.parse(localStorage.getItem('betResults'));
    if (betResults != undefined && betResults != null && betResults.length > 0) {
        let showArr = [];
        for (let i = 0; i < betResults.length; i++) {
            let result = betResults[i]
            let show = 
            `<tr>
                <td>${result.drawingTime}</td>
                <td>${result.betNumber}</td>
                <td>${result.betAmount}</td>
                <td>${result.betResult}</td>
            </tr>
            `
            showArr.push(show);
        }
        document.querySelector(".betResults").innerHTML = showArr.join("");
    } else {
        document.querySelector(".betResults").innerHTML = "";
    }
};

const deposit = async () => {
    const amount = document.querySelector(".depositAmount").value;
    if (amount === "" || amount < 100000000) {
        const errMsg = "deposit amount can not less than 100000000!";
        alert(errMsg);
        console.warn(errMsg);
        return;
    }

    await rouletteGame.methods
        .deposit()
        .send({from: window.userWalletAddress, value: amount});
    
    showPlayerStatus();
};

document.querySelector(".deposit").addEventListener("click", deposit);

const withdraw = async () => {
    const amount = document.querySelector(".withdrawAmount").value;
    if (amount === "" || amount <= 0) {
        const errMsg = "withdraw amount can not less than 0!";
        alert(errMsg);
        console.warn(errMsg);
        return;
    };

    await rouletteGame.methods
        .withdraw(window.userWalletAddress, amount)
        .send({from: window.userWalletAddress});
    
    showPlayerStatus();
};

document.querySelector(".withdraw").addEventListener("click", withdraw);

const betAction = async () => {
    const betNumber = document.querySelector(".betNumber").value;
    const betAmount = document.querySelector(".betAmount").value;

    if (betNumber <= 0 || betNumber > 12) {
        alert("Bet number must between 1 and 12!");
        return;
    }
    if (betAmount <= 0 || betAmount > playBalance) {
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
        .makeBet(window.userWalletAddress, betAmount, betNumber, commitment)
        .send({ value: flipFee, from: window.userWalletAddress });

    const sequenceNumber = receipt.events.BetRequest.returnValues.sequenceNumber;
    console.log(`   sequence  : ${sequenceNumber}`);
    
    localStorage.userRandomNumber = randomNumber;
    localStorage.sequenceNumber = sequenceNumber;
    showPlayerStatus();
};  

document.querySelector(".betAction").addEventListener("click", betAction);

const drawingAction = async () => {
    if (betInfo.betNumber == 0 || betInfo.betAmount == 0 || betInfo.sequenceNumber == 0) {
        alert("You haven't bet yet! Please make a bet!");
        return;
    }

    const fortunaUrl = "https://fortuna-staging.pyth.network";
    const chainName = "lightlink_pegasus";
    const url = `${fortunaUrl}/v1/chains/${chainName}/revelations/${betInfo.sequenceNumber}`;
    const response = await axios.get(url);
    const providerRandom = `0x${response.data.value.data}`;
    console.log(`   provider  : ${providerRandom}`);

    const receipt = await rouletteGame.methods
        .drawing(window.userWalletAddress, 
            localStorage.sequenceNumber, 
            localStorage.userRandomNumber, 
            providerRandom)
        .send({ from: window.userWalletAddress });

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
        betNumber: betInfo.betNumber,
        betAmount: betInfo.betAmount,
        betResult: isWin ? "win" : "lose",
    };

    let betResults = JSON.parse(localStorage.getItem('betResults'));
    if (betResults == undefined || !Array.isArray(betResults) || betResults.length <= 0) {
        betResults= new Array(result);
    } else {
        betResults.push(result);
    }
    localStorage.setItem('betResults', JSON.stringify(betResults));

    showPlayerStatus();
};
document.querySelector(".drawingAction").addEventListener("click", drawingAction);
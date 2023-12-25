window.userWalletAddress = null;
let rouletteGame = null;
const contractAddress = "0xA6C2b8dF5E633F93787BAF4C214E056c3646eAeF";
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

        // show the user dashboard
        showUserDashboard();
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
    console.log(betInfo);
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
    let betInfo = {};
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

    const fortunaUrl = "https://fortuna-staging.pyth.network";
    const chainName = "lightlink_pegasus";
    const url = `${fortunaUrl}/v1/chains/${chainName}/revelations/${sequenceNumber}`;
    const response = await axios.get(url);
    const providerRandom = `0x${response.data.value.data}`;
    console.log(`   provider  : ${providerRandom}`);

    document.querySelector(".betShow").innerHTML = `You have bet (number: ${betNumber}, amount: ${betAmount})`;
    showPlayerStatus();
};  

document.querySelector(".betAction").addEventListener("click", betAction);

const drawingAction = async () => {
    const receipt = await rouletteGame.methods
        .drawing(window.userWalletAddress, window.betInfo.sequenceNumber, 
            window.betInfo.randomNumber, window.betInfo.providerRandom)
        .send({ from: window.userWalletAddress });

    const randomNumber = receipt.events.DrawingRequest.returnValues.randomNumber;
    const drawNumber = receipt.events.DrawingRequest.returnValues.drawNumber;
    console.log(`   drawNumber  : ${drawNumber}`);
};
document.querySelector(".drawingAction").addEventListener("click", drawingAction);
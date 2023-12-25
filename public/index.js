window.userWalletAddress = null;
let rouletteGame = null;
const contractAddress = "0x39d444Ae17Bfe80524c459FD1714224A30F4f618";
let playBalance = 0;

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
        showPlayerBalance();
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

const showPlayerBalance = async () => {
    playBalance = await rouletteGame.methods.getScore().call();
    console.log(playBalance);
    document.querySelector(".playAmount").innerHTML = playBalance;
};

const drawingSubmit = async () => {
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
        .requestFlip(commitment)
        .send({ value: flipFee, from: window.userWalletAddress });
    
    console.log(`   tx        : ${receipt.transactionHash}`);
    const sequenceNumber = receipt.events.FlipRequest.returnValues.sequenceNumber;
    console.log(`   sequence  : ${sequenceNumber}`);

    const fortunaUrl = "https://fortuna-staging.pyth.network";
    const chainName = "lightlink_pegasus";
    const url = `${fortunaUrl}/v1/chains/${chainName}/revelations/${sequenceNumber}`;
    const response = await axios.get(url);
    const providerRandom = `0x${response.data.value.data}`;

    const receipt2 = await rouletteGame.methods
        .revealFlip(sequenceNumber, randomNumber, providerRandom)
        .send({ from: window.userWalletAddress });

    const drawingNumber = receipt2.events.FlipResult.returnValues.drawingNumber;
    console.log(`   drawingNumber    : ${drawingNumber}`);

    betInfo["betNumber"] = betNumber;
    betInfo["randomNumber"] = randomNumber;
    betInfo["commitment"] = commitment;
    betInfo["flipFee"] = flipFee;
    betInfo["sequenceNumber"] = sequenceNumber;
    betInfo["drawingNumber"] = drawingNumber;
    document.querySelector(".betInfo").innerHTML = JSON.stringify(betInfo);
};

document.querySelector(".betAction").addEventListener("click", drawingSubmit);

const deposit = async () => {
    const amount = document.querySelector(".depositAmount").value;

    await rouletteGame.methods
        .deposit()
        .send({from: window.userWalletAddress, value: amount});
    
    showPlayerBalance();
};

document.querySelector(".deposit").addEventListener("click", deposit);

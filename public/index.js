window.userWalletAddress = null;
let rouletteGame = null;
const contractAddress = "0x9a6CdcDc003C9f4d65D25359daF9A42Ea4d1Cc67";

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
        document.querySelector(".walletLogin").innerHTML = "钱包已连接";
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
    rouletteGame = new window.web3.eth.Contract(abi, contractAddress, {from: window.userWalletAddress});
}

const showPlayerBalance = async () => {
    // await rouletteGame.methods.getInitAmount(window.userWalletAddress).send();
    let playBalance = await rouletteGame.methods.balanceOf(window.userWalletAddress).call();
    console.log(playBalance);
    document.querySelector(".playAmount").innerHTML = playBalance;
};

const drawingSubmit = async () => {
    const randomNumber = web3.utils.randomHex(32);
    const commitment = web3.utils.keccak256(randomNumber);
    const flipFee = await rouletteGame.methods.getFlipFee().call();

    const receipt = await rouletteGame.methods
        .requestFlip(commitment)
        .send({ value: flipFee, from: window.userWalletAddress });
    
    const sequenceNumber = receipt.events.FlipRequest.returnValues.sequenceNumber;

    const fortunaUrl = "https://fortuna-staging.pyth.network";
    const chainName = "lightlink-pegasus";
    const url = `${fortunaUrl}/v1/chains/${chainName}/revelations/${sequenceNumber}`;
    const response = await fetchWithRetry(url, 3);
    const providerRandom = `0x${response.value.data}`;

    const receipt2 = await rouletteGame.methods
        .revealFlip(sequenceNumber, randomNumber, providerRandom)
        .send({ from: window.userWalletAddress });

    const isHeads = receipt2.events.FlipResult.returnValues.isHeads;
    console.log(`   result    : ${isHeads ? "heads" : "tails"}`);
};

document.querySelector(".betAction").addEventListener("click", drawingSubmit);

const fetchWithRetry = async () => {
    let retryCount = 0;

    async function doRequest() {
        try {
        const response = await axios.get(url);
        return response.data;
        } catch (error) {
        if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(doRequest, 1000);
        } else {
            console.error("Max retry attempts reached. Exiting.");
            throw error;
        }
        }
    }

    return await doRequest(); // Start the initial request
}

let abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getInitAmount",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "betAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "betNumber",
          "type": "uint8"
        }
      ],
      "name": "makeBet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "playersBetInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "betAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "betNumber",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "playersBlance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "playersHasGetInitAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "prizePoolBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "random",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
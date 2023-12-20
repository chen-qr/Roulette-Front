window.userWalletAddress = null;
let rouletteGame = null;
const contractAddress = "0xcf01dBEB362710A077A1fe9D5540Cc8BE903e491";

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
    rouletteGame = new window.web3.eth.Contract(abi, contractAddress, {from: window.userWalletAddress});
}

const showPlayerBalance = async () => {
    let playBalance = await rouletteGame.methods.balanceOf(window.userWalletAddress).call();
    console.log(playBalance);
    document.querySelector(".playAmount").innerHTML = playBalance;
};

const drawingSubmit = async () => {
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
};

document.querySelector(".betAction").addEventListener("click", drawingSubmit);

const applyForAmount = async () => {
    await rouletteGame.methods
        .getInitAmount(window.userWalletAddress)
        .send({from: window.userWalletAddress});
    
    showPlayerBalance();
}

document.querySelector(".applyForAmount").addEventListener("click", applyForAmount);

let abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "IncorrectSender",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InsufficientFee",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "sequenceNumber",
          "type": "uint64"
        }
      ],
      "name": "FlipRequest",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "drawingNumber",
          "type": "uint64"
        }
      ],
      "name": "FlipResult",
      "type": "event"
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
      "inputs": [],
      "name": "getFlipFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "fee",
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
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "userCommitment",
          "type": "bytes32"
        }
      ],
      "name": "requestFlip",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "sequenceNumber",
          "type": "uint64"
        },
        {
          "internalType": "bytes32",
          "name": "userRandom",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "providerRandom",
          "type": "bytes32"
        }
      ],
      "name": "revealFlip",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
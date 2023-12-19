window.userWalletAddress = null;

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

const showPlayerBalance = async () => {
    let address = "0x0a53852a22054533B24958096d3D3B6bEA3b6Cb8";
    let rouletteGame = new window.web3.eth.Contract(abi, address);
    let playBalance = await rouletteGame.methods.balanceOf(window.userWalletAddress).call();
    console.log(playBalance);
    let prizePoolBalance = await rouletteGame.methods.prizePoolBalance().call();
    console.log(prizePoolBalance);
};

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
export async function initWalletAddress(setWalletAddress: Function) {
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
        setWalletAddress(selectedAccount);

        // store the user's wallet address in local storage
        window.localStorage.setItem("userWalletAddress", selectedAccount);

        } catch (error) {
        alert(error);
        }
    } else {
        alert("wallet not found");
    }
};
export async function initWalletAddress(setWalletAddress: Function) {
    if (window.web3) {
        try {
            const selectedAccount = await window.ethereum
                .request({
                    method: "eth_requestAccounts",
                })
                .then((accounts) => accounts[0])
                .catch(() => {
                    // if the user cancels the login prompt
                    throw Error("Please select an account");
                });

            setWalletAddress(selectedAccount);
        } catch (error) {
            alert(error);
        }
    } else {
        alert("wallet not found");
    }
};
import {contractAddress, abi} from './config'
import Web3 from "web3";

let rouletteGame = null;

async function createContract(walletAddress: string) {
  const web3 = new Web3(window.ethereum);
  rouletteGame = new web3.eth.Contract(abi, contractAddress, {from: walletAddress});
}

export async function initPlayerScore(walletAddress: string, setPlayerScore: Function) {
  if (rouletteGame == undefined || rouletteGame == null) {
    createContract(walletAddress)
  }  

  const score = await rouletteGame.methods.getScore().call();
  console.log("score: ", score)
  setPlayerScore(score)
}


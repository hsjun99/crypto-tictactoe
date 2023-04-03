import { ethers } from "ethers"
import provider from "../utils/provider"
import TicTacToe from "../../../backend/artifacts/contracts/TicTacToe.sol/TicTacToe.json"

async function getGameContract() {
    const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const contract = new ethers.Contract(address, TicTacToe.abi, provider.getSigner())
    console.log(contract)
    return contract
}

export default getGameContract

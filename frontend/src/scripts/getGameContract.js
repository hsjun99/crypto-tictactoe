import { ethers } from "ethers"
import provider from "../utils/provider"
import TicTacToe from "../../../smartcontract/artifacts/contracts/TicTacToe.sol/TicTacToe.json"

async function getGameContract() {
    const address = "0x4c77E05ab184De5fa83399303b49142050148db3"
    const contract = new ethers.Contract(address, TicTacToe.abi, provider.getSigner())
    return contract
}

export default getGameContract

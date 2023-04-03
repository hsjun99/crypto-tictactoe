import getGameContract from "./getGameContract"
import { ethers } from "ethers"

async function createGame(name) {
    const contract = await getGameContract()
    const amount = ethers.utils.parseEther("0.05")
    const receipt = await contract.createGame(name, { value: amount })
    await receipt.wait()
}

export default createGame

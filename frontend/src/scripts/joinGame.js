import getGameContract from "./getGameContract"
import { ethers } from "ethers"

async function joinGame(gameNum) {
    const contract = await getGameContract()
    const receipt = await contract.joinGame(gameNum, { value: ethers.utils.parseEther("0.05") })
    await receipt.wait()
}

export default joinGame

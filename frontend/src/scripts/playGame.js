import getGameContract from "./getGameContract"

async function playGame(gameNum, x, y) {
    const contract = await getGameContract()
    const receipt = await contract.play(gameNum, x, y)
    await receipt.wait()
}

export default playGame

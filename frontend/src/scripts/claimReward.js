import getGameContract from "./getGameContract"

async function claimReward(gameNum, claimType) {
    const contract = await getGameContract()

    if (claimType == "tie") {
        const receipt = await contract.claimTie(gameNum)
        receipt.wait()
    } else if (claimType == "win") {
        const receipt = await contract.claimWin(gameNum)
        receipt.wait()
    }
}

export default claimReward

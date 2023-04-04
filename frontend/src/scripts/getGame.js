import getGameContract from "./getGameContract"
import GAME_STATUS from "../utils/gameStatus"

async function getGame(gameNum) {
    const contract = await getGameContract()
    const game = await contract.getGameData(gameNum)

    return {
        key: gameNum,
        name: game[0],
        players: game[1],
        board: game[2],
        turn: game[3],
        winner: game[4],
        status: GAME_STATUS[game[5]],
        rewardClaimed: game[6],
    }
}

export default getGame

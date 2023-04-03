import getGameContract from "./getGameContract"
import GAME_STATUS from "../utils/gameStatus"

async function getGameAll() {
    const contract = await getGameContract()
    const gameCnt = await contract.gameCnt()
    const gamesData = []
    for (let i = 0; i < gameCnt; i++) {
        const gameData = await contract.getGameData(i)
        gamesData.push(gameData)
    }
    const games = gamesData.map((game, index) => {
        return {
            key: index,
            name: game[0],
            players: game[1],
            board: game[2],
            turn: game[3],
            winner: game[4],
            status: GAME_STATUS[game[5]],
        }
    })
    return games
}

export default getGameAll

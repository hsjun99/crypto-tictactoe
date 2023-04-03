import getGameContract from "./getGameContract";

async function getGame(gameNum) {
  const contract = await getGameContract();
  const gameData = await contract.getGameData(gameNum);
  return gameData;
}

export default getGame;

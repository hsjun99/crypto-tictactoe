import getGameContract from "./getGameContract";

async function createGame(name) {
  const contract = await getGameContract();
  const amount = ethers.utils.parseEther("0.05");
  const receipt = await contract.createGame(name, { value: amount });
  await receipt.wait();
  console.log("complete!!!!!");
  console.log(await contract.gameCnt());
  console.log(await contract.getGameData(0));
}

export default createGame;

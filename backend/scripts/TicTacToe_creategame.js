const hre = require("hardhat")

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const Contract = await hre.ethers.getContractAt("TicTacToe", contractAddress)
    const amount = ethers.utils.parseEther("0.05")
    // console.log(Contract)
    const receipt = await Contract.createGame("game2", { value: amount })
    // console.log(receipt)
    await receipt.wait()
    console.log("complete!!!!!")

    console.log(await Contract.gameCnt())
    console.log(await Contract.getGameData(0))
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

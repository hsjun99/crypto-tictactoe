import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Box, Flex } from "@chakra-ui/react"
import AuthButton from "./components/AuthButton"
import Board from "./components/Board"
import GameList from "./components/GameList"
import getGameContract from "./scripts/getGameContract"

function App() {
    const [userAddress, setUserAddress] = useState("")
    const [games, setGames] = useState({})
    const [joinedGame, setJoinedGame] = useState(null)

    const queryClient = new QueryClient()

    useEffect(() => {
        getGameContract().then((contract) => {
            contract.on("Played", (gameNum) => {
                console.log("Played")
                if (joinedGame != null && gameNum == joinedGame.key) {
                    queryClient.invalidateQueries(`Game-${gameNum}`)
                }
            })
            contract.on("GameCreated", (gameNum) => {
                console.log("GameCreated")
                queryClient.invalidateQueries(["GamesData"])
            })
            contract.on("JoinedGame", (gameNum) => {
                console.log("JoinedGame")
                if (joinedGame != null && gameNum == joinedGame.key) {
                    queryClient.invalidateQueries(`Game-${gameNum}`)
                }
            })
            contract.on("GameFinished", (gameNum) => {
                console.log("GameFinished")
                if (joinedGame != null && gameNum == joinedGame.key) {
                    queryClient.invalidateQueries(`Game-${gameNum}`)
                }
            })
            contract.on("RewardClaimed", (gameNum) => {
                console.log("RewardClaimed")
                if (joinedGame != null && gameNum == joinedGame.key) {
                    queryClient.invalidateQueries(`Game-${gameNum}`)
                }
            })
        })
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <Box w="100vw">
                <Flex justify="end" mr="16px" mt="16px">
                    <AuthButton setUserAddress={setUserAddress} />
                </Flex>
                {joinedGame == null && (
                    <GameList
                        userAddress={userAddress}
                        setJoinedGame={setJoinedGame}
                        games={games}
                        setGames={setGames}
                    ></GameList>
                )}
                {/* {joinedGame == null && <GameForm></GameForm>} */}
                {joinedGame != null && <Board game={joinedGame} userAddress={userAddress}></Board>}
            </Box>
        </QueryClientProvider>
    )
}

export default App

import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Box, Flex } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
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
            <Router>
                <Box w="100vw">
                    <Flex justify="end" mr="16px" mt="16px">
                        <AuthButton setUserAddress={setUserAddress} />
                    </Flex>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <GameList
                                    userAddress={userAddress}
                                    setJoinedGame={setJoinedGame}
                                    games={games}
                                    setGames={setGames}
                                ></GameList>
                            }
                        ></Route>
                        <Route
                            path="/game/:gameId"
                            element={<Board game={joinedGame} userAddress={userAddress}></Board>}
                        ></Route>
                    </Routes>
                </Box>
            </Router>
        </QueryClientProvider>
    )
}

export default App

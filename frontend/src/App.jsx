import { useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Box, Flex } from "@chakra-ui/react"
import AuthButton from "./components/AuthButton"
import Board from "./components/Board"
import GameList from "./components/GameList"
import GameForm from "./components/GameForm"

function App() {
    const [userAddress, setUserAddress] = useState("")
    // const [player, setPlayer] = useState({})
    const [games, setGames] = useState({})
    const [joinedGame, setJoinedGame] = useState(null)

    const queryClient = new QueryClient()

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

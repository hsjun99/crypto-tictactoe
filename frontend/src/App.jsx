import { useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Box, Flex } from "@chakra-ui/react"
import AuthButton from "./components/AuthButton"
import Test from "./components/Test"
import GameList from "./components/GameList"
import GameForm from "./components/GameForm"

function App() {
    const [userAddress, setUserAddress] = useState("")
    const [player, setPlayer] = useState({})
    const [game, setGame] = useState({})

    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <Box w="100vw">
                <Flex justify="end" mr="16px" mt="16px">
                    <AuthButton setUserAddress={setUserAddress} />
                </Flex>
                <GameList></GameList>
                <GameForm></GameForm>
            </Box>
        </QueryClientProvider>
    )
}

export default App

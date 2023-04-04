import { useEffect, useState } from "react"
import { Box, Button, Center, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react"
import trimAddress from "../utils/format"
import { useQuery, useMutation, useQueryClient } from "react-query"
import getGame from "../scripts/getGame"
import playGame from "../scripts/playGame"
import getGameContract from "../scripts/getGameContract"

const Board = ({ game, setGame, userAddress }) => {
    const [player, setPlayer] = useState("X")
    const [board, setBoard] = useState(Array(9).fill(null))
    const [winner, setWinner] = useState(null)

    const queryClient = useQueryClient()

    async function getGameData() {
        const gData = await getGame(game.key)
        return gData
    }

    async function postPlay({ x, y }) {
        await playGame(game.key, x, y)
    }

    const { data, isSuccess, isFetching, isLoading, isError, error } = useQuery(
        [`Game-${game.key}`],
        getGameData,
        {
            // enabled: !!userAddress,
            // refetchInterval: 5000
        }
    )

    getGameContract().then((contract) => {
        contract.on("Played", (gameNum, x, y, player) => {
            if (gameNum == game.key) {
                queryClient.invalidateQueries(`Game-${game.key}`)
                console.log("EVENT PLAYED!!")
            }
        })
    })

    const { mutate } = useMutation(postPlay, {
        onSuccess: () => {
            queryClient.invalidateQueries(`Game-${game.key}`)
        },
    })

    const handleSquareClick = (index) => {
        const x = Math.floor(index / 3)
        const y = index % 3
        mutate({ x, y })
        if (data?.turn != player) return
        if (winner || board[index]) return

        // const newBoard = [...board]
        // newBoard[index] = player
        // setBoard(newBoard)

        // const newPlayer = player === "X" ? "O" : "X"
        // setPlayer(newPlayer)

        // const newWinner = calculateWinner(newBoard)
        // setWinner(newWinner)
    }

    const calculateWinner = (board) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]
            }
        }

        return null
    }

    // const handleResetClick = () => {
    //     setPlayer("X")
    //     setBoard(Array(9).fill(null))
    //     setWinner(null)
    // }

    return (
        <Center height="100vh" bg="gray.50">
            <Box borderWidth="1px" borderRadius="lg" padding="8" bg="white" boxShadow="md">
                <Heading as="h1" size="lg" textAlign="center" mb="8">
                    Tic Tac Toe
                </Heading>
                <Grid templateColumns="repeat(3, 1fr)" gap="4">
                    {data?.board?.flat().map((value, index) => (
                        <GridItem key={index}>
                            <Button
                                size="lg"
                                height="20"
                                width="full"
                                variant="outline"
                                borderColor="gray.300"
                                _hover={{ borderColor: "gray.500" }}
                                _active={{ borderColor: "gray.500" }}
                                _focus={{ outline: "none" }}
                                fontSize="4xl"
                                fontWeight="bold"
                                onClick={() => handleSquareClick(index)}
                            >
                                {/* {99} */}
                                {value == 1 ? "X" : value == 2 ? "O" : null}
                            </Button>
                        </GridItem>
                    ))}
                </Grid>
                <Box marginTop="8">
                    {winner ? (
                        <Text fontSize="3xl" textAlign="center" fontWeight="bold">
                            Winner: {winner}
                        </Text>
                    ) : (
                        <Text fontSize="3xl" textAlign="center" fontWeight="bold">
                            Next player: {trimAddress(game.turn)}
                        </Text>
                    )}
                </Box>
            </Box>
        </Center>
    )
}

export default Board

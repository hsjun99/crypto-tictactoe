import { useState, useEffect } from "react"
import { Box, Center, Text, Badge, Flex, Heading, Stack, Button } from "@chakra-ui/react"
import getGameAll from "../scripts/getGameAll"
import { useQuery } from "react-query"
import joinGame from "../scripts/joinGame"
import GameForm from "./GameForm"
import { Link } from "react-router-dom"

const GameCard = ({ game, onClick }) => {
    const { name, status, players } = game
    const statusColor = status === "waiting" ? "gray" : status === "playing" ? "yellow" : "green"

    return (
        <Box
            w="100%"
            h="auto"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            onClick={onClick}
            _hover={{
                boxShadow: "lg",
            }}
        >
            <Box p="4">
                <Box d="flex" alignItems="baseline">
                    <Badge borderRadius="full" px="2" colorScheme={statusColor}>
                        {status}
                    </Badge>
                    <Text ml="2" fontWeight="semibold" fontSize="lg" lineHeight="short">
                        {name}
                    </Text>
                </Box>

                <Box mt="2">
                    <Flex alignItems="center">
                        <Text fontWeight="semibold" mr="2">
                            Participants:
                        </Text>
                        <Text>{players.length}</Text>
                    </Flex>
                </Box>
            </Box>
        </Box>
    )
}

const GameList = ({ userAddress, setJoinedGame }) => {
    const [selectedGame, setSelectedGame] = useState(null)

    async function handleJoinGame() {
        setJoinedGame(selectedGame)
        if (!selectedGame.players.includes(userAddress)) {
            await joinGame(selectedGame.key)
        }
    }

    async function getGamesData() {
        const gData = await getGameAll()
        return gData
    }

    const { data, isSuccess, isFetching, isLoading, isError, error } = useQuery(
        ["GamesData"],
        getGamesData,
        {
            // enabled: !!userAddress,
            // refetchInterval: 5000
        }
    )

    const handleGameClick = (game) => {
        setSelectedGame(game)
    }

    const groupGamesByStatus = (games) => {
        const waitingGames = []
        const playingGames = []
        const finishedGames = []
        games.forEach((game) => {
            if (game.status === "waiting") {
                waitingGames.push(game)
            } else if (game.status === "playing") {
                playingGames.push(game)
            } else if (game.status === "finished") {
                finishedGames.push(game)
            }
        })
        return { waitingGames, playingGames, finishedGames }
    }

    const { waitingGames, playingGames, finishedGames } = groupGamesByStatus(data || [])

    return (
        <Box maxW="800px" mx="auto" minHeight="100vh">
            <Center my="2">
                <Heading>Game Board</Heading>
            </Center>
            <Box display="flex" justifyContent="flex-end">
                <Box p="2">
                    <GameForm />
                </Box>
            </Box>
            <Flex justify="space-between" minHeight="70vh" p="4">
                <Box
                    width="250px"
                    p="4"
                    m="-4"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderRadius: "8px" }}
                >
                    <Heading as="h2" size="md">
                        Waiting Games
                    </Heading>
                    <Stack spacing="4">
                        {waitingGames?.map((game, index) => (
                            <GameCard
                                key={index}
                                game={game}
                                onClick={() => handleGameClick(game)}
                            />
                        ))}
                    </Stack>
                </Box>
                <Box
                    width="250px"
                    p="4"
                    m="-4"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderRadius: "8px" }}
                >
                    <Heading as="h2" size="md">
                        Playing Games
                    </Heading>
                    <Stack spacing="4">
                        {playingGames?.map((game, index) => (
                            <GameCard
                                key={index}
                                game={game}
                                onClick={() => handleGameClick(game)}
                            />
                        ))}
                    </Stack>
                </Box>
                <Box
                    width="250px"
                    p="4"
                    m="-4"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)", borderRadius: "8px" }}
                >
                    <Heading as="h2" size="md">
                        Finished Games
                    </Heading>
                    <Stack spacing="4">
                        {finishedGames?.map((game, index) => (
                            <GameCard
                                key={index}
                                game={game}
                                onClick={() => handleGameClick(game)}
                            />
                        ))}
                    </Stack>
                </Box>
            </Flex>
            {selectedGame && (
                <Box mt="8">
                    <Center>
                        <Text fontWeight="bold">Selected game: {selectedGame.name}</Text>
                    </Center>
                    <Flex mt="4" justify="center">
                        <Link to={{ pathname: "/game/" + selectedGame.key }}>
                            <Button mr="4" colorScheme="green" onClick={() => handleJoinGame()}>
                                {selectedGame.players.includes(userAddress)
                                    ? "Enter Game"
                                    : "Join Game"}
                            </Button>
                        </Link>
                        <Button colorScheme="red" onClick={() => setSelectedGame(null)}>
                            Cancel
                        </Button>
                    </Flex>
                </Box>
            )}
        </Box>
    )
}

export default GameList

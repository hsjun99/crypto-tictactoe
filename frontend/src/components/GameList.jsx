import { useState, useEffect } from "react";
import {
  Box,
  Center,
  Text,
  Badge,
  Flex,
  Heading,
  Stack,
  Button,
} from "@chakra-ui/react";
import getGame from "../scripts/getGame";

const games = [
  { name: "Game 1", status: "waiting", participants: 2 },
  { name: "Game 2", status: "playing", participants: 3 },
  { name: "Game 3", status: "finished", participants: 4 },
];

const GAME_STATUS = { 0: "waiting", 1: "playing", 2: "finished" };

const GameCard = ({ game, onClick }) => {
  const [gameData, getGameData] = useState(game);

  useEffect(() => {
    async function getGameData(gameNum) {
      const game = await getGame(gameNum);
      console.log(game);
    }

    getGameData(0);
  }, []);

  const { name, status, participants } = game;
  const statusColor =
    status === "waiting" ? "gray" : status === "playing" ? "yellow" : "green";

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
            <Text>{participants}</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

const GameList = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  return (
    <Box maxW="800px" mx="auto">
      <Center my="8">
        <Heading>Game List</Heading>
      </Center>
      <Stack spacing="4">
        {games.map((game, index) => (
          <GameCard
            key={index}
            game={game}
            onClick={() => handleGameClick(game)}
          />
        ))}
      </Stack>
      {selectedGame && (
        <Box mt="8">
          <Center>
            <Text fontWeight="bold">Selected game: {selectedGame.name}</Text>
          </Center>
          <Flex mt="4" justify="center">
            <Button mr="4" colorScheme="green">
              Join Game
            </Button>
            <Button colorScheme="red" onClick={() => setSelectedGame(null)}>
              Cancel
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default GameList;

import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@chakra-ui/react";

const TicTacToe = () => {
  const [player, setPlayer] = useState("X");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  const handleSquareClick = (index) => {
    if (winner || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const newPlayer = player === "X" ? "O" : "X";
    setPlayer(newPlayer);

    const newWinner = calculateWinner(newBoard);
    setWinner(newWinner);
  };

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
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const handleResetClick = () => {
    setPlayer("X");
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  return (
    <Center height="100vh" bg="gray.50">
      <Box
        borderWidth="1px"
        borderRadius="lg"
        padding="8"
        bg="white"
        boxShadow="md"
      >
        <Heading as="h1" size="lg" textAlign="center" mb="8">
          Tic Tac Toe
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap="4">
          {board.map((value, index) => (
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
                {value}
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
              Next player: {player}
            </Text>
          )}
          <Flex justifyContent="center" marginTop="8">
            <Button
              variant="solid"
              size="lg"
              onClick={handleResetClick}
              colorScheme="blue"
              _hover={{ bg: "blue.500" }}
              _active={{ bg: ".blue.600" }}
              _focus={{ outline: "none" }}
              marginLeft="4"
            >
              Reset
            </Button>
          </Flex>
        </Box>
      </Box>
    </Center>
  );
};

export default TicTacToe;

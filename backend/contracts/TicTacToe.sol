// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract TicTacToe {
    event Played(uint256 indexed gameNum, uint8 x, uint8 y, address player);
    event GameCreated(uint256 indexed gameNum, string name);
    event JoinedGame(uint256 indexed gameNum, address player);
    event GameFinished(uint256 indexed gameNum);
    event RewardClaimed(uint256 indexed gameNum, address player);

    enum GameStatus {
        Waiting,
        Playing,
        Finished
    }
    mapping(uint256 => string) public name;
    mapping(uint256 => address[]) public players;
    mapping(uint256 => uint8[3][3]) public board;
    mapping(uint256 => address) public turn;
    mapping(uint256 => address) public winner;
    mapping(uint256 => GameStatus) public status;
    mapping(uint256 => bool[2]) public rewardClaimed;

    uint256 public gameCnt;

    constructor() {
        gameCnt = 0;
    }

    function getGameData(
        uint256 gameNum
    )
        public
        view
        returns (
            string memory,
            address[] memory,
            uint8[3][3] memory,
            address,
            address,
            GameStatus,
            bool[2] memory
        )
    {
        return (
            name[gameNum],
            players[gameNum],
            board[gameNum],
            turn[gameNum],
            winner[gameNum],
            status[gameNum],
            rewardClaimed[gameNum]
        );
    }

    function createGame(string memory _name) public payable {
        name[gameCnt] = _name;
        joinGame(gameCnt);
        turn[gameCnt] = msg.sender;
        emit GameCreated(gameCnt, _name);
        gameCnt++;
    }

    function joinGame(uint256 gameNum) public payable {
        require(msg.value == 0.05 ether, "You must send 0.05 ether");
        require(status[gameNum] == GameStatus.Waiting, "Game is already full");

        players[gameNum].push(msg.sender);
        players[gameNum].length == 2
            ? status[gameNum] = GameStatus.Playing
            : status[gameNum] = GameStatus.Waiting;

        emit JoinedGame(gameNum, msg.sender);
    }

    function play(uint256 gameNum, uint8 x, uint8 y) public {
        require(turn[gameNum] == msg.sender, "It's not your turn");
        require(board[gameNum][x][y] == 0, "This field is already taken");
        require(status[gameNum] == GameStatus.Playing, "Game is not playing");

        uint8 playerIndex = turn[gameNum] == players[gameNum][0] ? 1 : 2;

        board[gameNum][x][y] = playerIndex;

        emit Played(gameNum, x, y, msg.sender);

        turn[gameNum] = turn[gameNum] == players[gameNum][0]
            ? players[gameNum][1]
            : players[gameNum][0];

        if (checkWin(gameNum, playerIndex)) {
            winner[gameNum] = players[gameNum][playerIndex - 1];
            status[gameNum] = GameStatus.Finished;
            emit GameFinished(gameNum);
        } else if (checkTie(gameNum)) {
            status[gameNum] = GameStatus.Finished;
            emit GameFinished(gameNum);
        }
    }

    function claimWin(uint256 gameNum) public {
        require(status[gameNum] == GameStatus.Finished, "Game is not finished");
        require(msg.sender == winner[gameNum], "You are not the winner");

        (bool success, ) = winner[gameNum].call{value: 0.1 ether}("");
        require(success, "Transfer failed.");

        players[gameNum][0] == winner[gameNum]
            ? rewardClaimed[gameNum][0] = true
            : rewardClaimed[gameNum][1] = true;

        emit RewardClaimed(gameNum, msg.sender);
    }

    function claimTie(uint256 gameNum) public {
        require(status[gameNum] == GameStatus.Finished, "Game is not finished");
        require(winner[gameNum] == address(0), "There is a winner");
        require(
            msg.sender == players[gameNum][0] || msg.sender == players[gameNum][1],
            "You are not the player"
        );

        (bool success, ) = msg.sender.call{value: 0.05 ether}("");
        require(success, "Transfer failed.");

        players[gameNum][0] == msg.sender
            ? rewardClaimed[gameNum][0] = true
            : rewardClaimed[gameNum][1] = true;

        emit RewardClaimed(gameNum, msg.sender);
    }

    function checkTie(uint256 gameNum) internal view returns (bool) {
        uint8[3][3] memory gameBoard = board[gameNum];
        if (
            gameBoard[0][0] != 0 &&
            gameBoard[0][1] != 0 &&
            gameBoard[0][2] != 0 &&
            gameBoard[1][0] != 0 &&
            gameBoard[1][1] != 0 &&
            gameBoard[1][2] != 0 &&
            gameBoard[2][0] != 0 &&
            gameBoard[2][1] != 0 &&
            gameBoard[2][2] != 0
        ) {
            return true;
        } else {
            return false;
        }
    }

    function checkWin(uint256 gameNum, uint8 playerIndex) internal view returns (bool) {
        uint8[3][3] memory gameBoard = board[gameNum];

        // Check rows
        for (uint8 i = 0; i < 3; i++) {
            if (
                gameBoard[i][0] == playerIndex &&
                gameBoard[i][1] == playerIndex &&
                gameBoard[i][2] == playerIndex
            ) {
                return true;
            }
        }

        // Check columns
        for (uint8 j = 0; j < 3; j++) {
            if (
                gameBoard[0][j] == playerIndex &&
                gameBoard[1][j] == playerIndex &&
                gameBoard[2][j] == playerIndex
            ) {
                return true;
            }
        }

        // Check diagonals
        if (
            gameBoard[0][0] == playerIndex &&
            gameBoard[1][1] == playerIndex &&
            gameBoard[2][2] == playerIndex
        ) {
            return true;
        }
        if (
            gameBoard[0][2] == playerIndex &&
            gameBoard[1][1] == playerIndex &&
            gameBoard[2][0] == playerIndex
        ) {
            return true;
        }

        // No winner yet
        return false;
    }
}

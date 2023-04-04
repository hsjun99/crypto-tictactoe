import { useState } from "react"
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "react-query"
import createGame from "../scripts/createGame"

const GameForm = ({}) => {
    const [name, setName] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const queryClient = useQueryClient()

    const handleSubmit = (event) => {
        event.preventDefault()
        // onSubmit({
        //     name,
        //     status,
        //     participants: parseInt(participants),
        // })
        // setName()
        // setStatus("waiting")
        // setParticipants("")
        setIsOpen(false)
        mutate(name)
    }

    const { mutate } = useMutation(createGame, {
        onSuccess: () => {
            queryClient.invalidateQueries("GamesData")
        },
    })

    return (
        <>
            <Button justify="end" mr="16px" mt="16px" onClick={() => setIsOpen(true)}>
                + New Game
            </Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Game</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing="4">
                                <FormControl id="name" isRequired>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </FormControl>
                                {/* <FormControl id="status" isRequired>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        value={status}
                                        onChange={(event) => setStatus(event.target.value)}
                                    >
                                        <option value="waiting">Waiting</option>
                                        <option value="playing">Playing</option>
                                        <option value="finished">Finished</option>
                                    </Select>
                                </FormControl> */}
                                {/* <FormControl id="participants" isRequired>
                                    <FormLabel>Number of Participants</FormLabel>
                                    <Input
                                        type="number"
                                        value={participants}
                                        onChange={(event) => setParticipants(event.target.value)}
                                    />
                                </FormControl> */}
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit}>Create</Button>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GameForm

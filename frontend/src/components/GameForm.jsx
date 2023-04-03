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

const GameForm = ({ onSubmit }) => {
    const [name, setName] = useState("")
    const [status, setStatus] = useState("waiting")
    const [participants, setParticipants] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        onSubmit({
            name,
            status,
            participants: parseInt(participants),
        })
        setName("")
        setStatus("waiting")
        setParticipants("")
        setIsOpen(false)
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Create New Game</Button>
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
                                <FormControl id="status" isRequired>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        value={status}
                                        onChange={(event) => setStatus(event.target.value)}
                                    >
                                        <option value="waiting">Waiting</option>
                                        <option value="playing">Playing</option>
                                        <option value="finished">Finished</option>
                                    </Select>
                                </FormControl>
                                <FormControl id="participants" isRequired>
                                    <FormLabel>Number of Participants</FormLabel>
                                    <Input
                                        type="number"
                                        value={participants}
                                        onChange={(event) => setParticipants(event.target.value)}
                                    />
                                </FormControl>
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

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Box, Flex } from "@chakra-ui/react";
import AuthButton from "./components/AuthButton";

function App() {
  const [userAddress, setUserAddress] = useState("");

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Box w="100vw">
        <Flex justify="end" mr="16px" mt="16px">
          <AuthButton setUserAddress={setUserAddress} />
        </Flex>
      </Box>
    </QueryClientProvider>
  );
}

export default App;

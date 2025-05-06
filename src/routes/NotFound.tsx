import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function NotFound() {
  return (
    <Box>
      <Header/>
      <VStack justifyContent={"center"} minH={"100vh"}>
          <Heading>404 Not Found</Heading>
          <Text></Text>
          <Link to="/">
              <Button colorScheme={"purple"} variant={"solid"}>Go Home</Button>
          </Link>
      </VStack>
    </Box>
  );
}
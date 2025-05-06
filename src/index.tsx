import { Box, Center, ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import router from "./router";
import theme from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const client = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
  <QueryClientProvider client={client}>
    <ChakraProvider theme={theme}>
      <Center minH="100vh">
      <Box maxW="1000px" w={"full"}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
      <RouterProvider router={router}/>
      </Box>
      </Center>
    </ChakraProvider>
  </QueryClientProvider>

);


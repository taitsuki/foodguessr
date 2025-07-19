// app/javascript/App.jsx
import React from "react";
import { ChakraProvider, Button } from "@chakra-ui/react";

const App = () => (
  <ChakraProvider>
    <Button colorScheme="teal">Chakra Button</Button>
  </ChakraProvider>
);

export default App;

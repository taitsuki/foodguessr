// app/javascript/App.jsx
import React, { useState } from "react";
import {
  ChakraProvider,
  Button,
  Box,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const App = () => {
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomGenre = async () => {
    setLoading(true);
    setError(null);
    setGenre(null);

    try {
      const response = await fetch("/api/v1/food_genres/random");
      const data = await response.json();

      if (data.name) {
        setGenre(data);
      } else {
        setError("ジャンルが見つかりません");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Box p={6} maxW="600px" mx="auto">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            FoodGuessr
          </Heading>

          <Button
            colorScheme="teal"
            size="lg"
            onClick={fetchRandomGenre}
            isLoading={loading}
            loadingText="読み込み中..."
          >
            ランダムジャンル表示
          </Button>

          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {genre && (
            <Box
              p={6}
              bg="blue.50"
              borderRadius="lg"
              border="1px"
              borderColor="blue.200"
              shadow="md"
            >
              <Heading size="md" mb={3} color="blue.800">
                {genre.name}
              </Heading>
              {genre.description && (
                <Text color="blue.700" fontSize="md">
                  {genre.description}
                </Text>
              )}
            </Box>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;

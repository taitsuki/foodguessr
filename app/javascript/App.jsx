// app/javascript/App.jsx
import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Button,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  List,
  ListItem,
} from "@chakra-ui/react";

const App = () => {
  const [pair, setPair] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]); // 選択履歴

  const fetchPair = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/food_genres/two_random");
      const data = await response.json();

      if (Array.isArray(data) && data.length === 2) {
        setPair(data);
      } else {
        setError("ジャンルが取得できませんでした");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 初回表示時に取得
  useEffect(() => {
    fetchPair();
  }, []);

  // ボタン選択時に次の2択を取得
  const handleSelect = (selectedGenre) => {
    // 必要なら選択履歴やスコア管理もここで
    setHistory([...history, selectedGenre]);
    fetchPair();
  };

  return (
    <ChakraProvider>
      <Box p={6} maxW="600px" mx="auto">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            外食何食べる？
          </Heading>

          {loading && <Text>読み込み中...</Text>}

          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && pair.length === 2 && (
            <HStack spacing={8} justify="center">
              {pair.map((genre) => (
                <Button
                  key={genre.id}
                  colorScheme="teal"
                  size="lg"
                  onClick={() => handleSelect(genre)}
                  minW="40%"
                  p={6}
                >
                  <VStack>
                    <Text fontWeight="bold" fontSize="xl">
                      {genre.name}
                    </Text>
                    {genre.description && (
                      <Text color="gray.600" fontSize="md">
                        {genre.description}
                      </Text>
                    )}
                  </VStack>
                </Button>
              ))}
            </HStack>
          )}

          {!loading && !error && pair.length < 2 && (
            <Text>ジャンルが足りません</Text>
          )}

          {/* 選択履歴の表示 */}
          {history.length > 0 && (
            <>
              <Divider my={4} />
              <Heading size="md" mb={2}>
                選択履歴
              </Heading>
              <List spacing={2}>
                {history.map((genre, idx) => (
                  <ListItem key={idx}>
                    <Text>
                      {idx + 1}. {genre.name}{" "}
                      {genre.description && `- ${genre.description}`}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;

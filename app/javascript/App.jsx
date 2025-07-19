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
  Spinner,
} from "@chakra-ui/react";

const App = () => {
  const [pair, setPair] = useState([]); // 表示するジャンル(2択)
  const [loading, setLoading] = useState(false); // APIリクエスト中かどうか
  const [error, setError] = useState(null); // エラーメッセージ
  const [history, setHistory] = useState({}); // 選択回数を記録するオブジェクト { [genre.id]: { genre, count } }

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

  // ボタン選択時に次の2択を取得し、履歴にカウント
  const handleSelect = (selectedGenre) => {
    setHistory((prev) => {
      const prevCount = prev[selectedGenre.id]?.count || 0;
      return {
        ...prev,
        [selectedGenre.id]: {
          genre: selectedGenre,
          count: prevCount + 1,
        },
      };
    });
    fetchPair();
  };

  // 履歴を配列に変換して回数順にソート
  const sortedHistory = Object.values(history).sort(
    (a, b) => b.count - a.count
  );
  const totalCount = sortedHistory.reduce((sum, item) => sum + item.count, 0);
  const mostSelected = sortedHistory[0]?.genre;

  return (
    <ChakraProvider>
      <Box p={6} maxW="600px" mx="auto">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            外食何食べる？
          </Heading>

          {totalCount >= 20 ? (
            <Box textAlign="center" mt={10}>
              <Heading size="lg" color="teal.600">
                {mostSelected
                  ? `${mostSelected.name}を食べるのはどうですか？`
                  : "ジャンルが選ばれていません"}
              </Heading>
            </Box>
          ) : (
            <>
              {/* {loading && <Text>読み込み中...</Text>} */}
              {loading && <Spinner />}

              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>エラー</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!loading && !error && pair.length === 2 && (
                <>
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
                  {/* ここに「どちらでもない」ボタンを追加 */}
                  <Box textAlign="center" mt={4}>
                    <Button
                      colorScheme="gray"
                      variant="outline"
                      size="md"
                      onClick={fetchPair}
                    >
                      どちらでもない
                    </Button>
                  </Box>
                </>
              )}

              {!loading && !error && pair.length < 2 && (
                <Text>ジャンルが足りません</Text>
              )}

              {/* 選択履歴の表示（回数順） */}
              {sortedHistory.length > 0 && (
                <>
                  <Divider my={4} />
                  <Heading size="md" mb={2}>
                    選択履歴（選ばれた回数順）
                  </Heading>
                  <List spacing={2}>
                    {sortedHistory.map(({ genre, count }) => (
                      <ListItem key={genre.id}>
                        <Text>
                          {genre.name}（{count}回）
                          {genre.description && ` - ${genre.description}`}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;

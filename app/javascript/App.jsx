// app/javascript/App.jsx
import React, { useState, useEffect, useRef } from "react";
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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorMode,
  extendTheme,
  ColorModeScript,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiSettings } from "react-icons/fi";

const MotionButton = motion(Button);

// Chakra UIのカラーモード設定
const theme = extendTheme({
  config: {
    initialColorMode: "light", // 一旦ライトモードで初期化
    useSystemColorMode: false, // 手動で制御する
  },
});

// RippleEffectコンポーネント
const RippleEffect = ({ children }) => {
  const [ripples, setRipples] = useState([]);
  const rippleContainer = useRef(null);

  const createRipple = (event) => {
    const container = rippleContainer.current;
    if (!container) return;
    // タッチイベント対応
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const rect = container.getBoundingClientRect();
    const size = 120; // 固定サイズ
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    const newRipple = {
      key: Date.now(),
      style: {
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        background: "rgba(0,0,0,0.13)",
        borderRadius: "50%",
        pointerEvents: "none",
        transform: "scale(0)",
        animation: "ripple 0.5s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 9999,
      },
    };
    setRipples((prev) => [...prev, newRipple]);
  };

  // Remove ripple after animation
  useEffect(() => {
    if (ripples.length === 0) return;
    const timeout = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 500);
    return () => clearTimeout(timeout);
  }, [ripples]);

  // 画面全体に広げる
  return (
    <div
      ref={rippleContainer}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 1, pointerEvents: "auto" }}
      onPointerDown={createRipple}
    >
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(1.0);
            opacity: 0;
          }
        }
      `}</style>
      {ripples.map((ripple) => (
        <span key={ripple.key} style={ripple.style} />
      ))}
      {/* childrenはzIndex:0で下に表示 */}
      <div style={{ position: "relative", zIndex: 0, width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
};

const App = () => {
  const [pair, setPair] = useState([]); // 表示するジャンル(2択)
  const [loading, setLoading] = useState(false); // APIリクエスト中かどうか
  const [error, setError] = useState(null); // エラーメッセージ
  const [history, setHistory] = useState({}); // 選択回数を記録するオブジェクト { [genre.id]: { genre, count } }
  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダルの表示状態
  const [colorMode, setColorMode] = useState("light"); // カラーモード（手動管理）
  const [isSystemMode, setIsSystemMode] = useState(true); // システムモードのチェック状態
  const [manualColorMode, setManualColorMode] = useState("light"); // 手動カラーモード（初期値）
  const [isInitialized, setIsInitialized] = useState(false); // 初期化完了フラグ
  const [buttonKeys, setButtonKeys] = useState(['left', 'right']); // ボタンの固定キー
  const [autoRetryCount, setAutoRetryCount] = useState({ left: 0, right: 0 }); // 自動再試行回数
  const prevPairRef = useRef([]); // 前回のpairの値を保持

  // ダークモード対応の色設定
  const bgColor = colorMode === "dark" ? "gray.900" : "white";
  const textColor = colorMode === "dark" ? "white" : "gray.800";
  const borderColor = colorMode === "dark" ? "gray.600" : "gray.300";

  // カラーモードを実際に変更する関数
  const updateColorMode = (mode) => {
    console.log("カラーモードを変更:", mode);
    setColorMode(mode);
    // ローカルストレージに保存
    localStorage.setItem('chakra-ui-color-mode', mode);
    // body要素の背景色も設定
    document.body.style.backgroundColor = mode === "dark" ? "#1a202c" : "#ffffff";
    document.body.style.color = mode === "dark" ? "#ffffff" : "#1a202c";
  };

  // システムのダークモードを検知して初期値を設定
  useEffect(() => {
    // ローカルストレージからカラーモードを読み込み
    const savedColorMode = localStorage.getItem('chakra-ui-color-mode');
    if (savedColorMode) {
      setColorMode(savedColorMode);
      // body要素の背景色も設定
      document.body.style.backgroundColor = savedColorMode === "dark" ? "#1a202c" : "#ffffff";
      document.body.style.color = savedColorMode === "dark" ? "#ffffff" : "#1a202c";
    }

    const detectSystemColorMode = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemMode = isDark ? "dark" : "light";
      console.log("システムカラーモード検知:", systemMode);
      setManualColorMode(systemMode);
      
      // システムモードが有効な場合は、システムの設定を適用
      if (isSystemMode) {
        updateColorMode(systemMode);
      }
    };

    detectSystemColorMode();
    setIsInitialized(true);
    
    // システムカラーモード変更時のリスナー
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newMode = e.matches ? "dark" : "light";
      console.log("システムカラーモード変更:", newMode);
      setManualColorMode(newMode);
      
      // システムモードが有効な時は、システムの変更を反映
      if (isSystemMode) {
        updateColorMode(newMode);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // クリーンアップ
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystemMode]);

  // システムのカラーモードを検知して初期値を設定
  useEffect(() => {
    // ページ読み込み時の初期化処理
    console.log("現在のカラーモード:", colorMode);
    console.log("システムモード:", isSystemMode);
    console.log("手動カラーモード:", manualColorMode);
  }, []); // 初回のみ実行

  // カラーモード変更時の処理
  const handleSystemModeChange = (isChecked) => {
    setIsSystemMode(isChecked);
    // システムモードが有効になった時、OSの設定に合わせてラジオボタンをリセット
    if (isChecked) {
      const systemColorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
      setManualColorMode(systemColorMode);
      updateColorMode(systemColorMode);
    } else {
      // 手動モードに切り替えた時、現在のmanualColorModeを適用
      updateColorMode(manualColorMode);
    }
  };

  // 手動カラーモード変更時の処理
  const handleManualColorModeChange = (value) => {
    setManualColorMode(value);
    if (!isSystemMode) {
      updateColorMode(value);
    }
  };

  // データが有効かどうかをチェックする関数
  const isValidData = (genre) => {
    console.log("Checking data validity:", genre);
    console.log("genre.name type:", typeof genre.name);
    console.log("genre.name value:", genre.name);
    console.log("genre.name length:", genre.name ? genre.name.length : 'undefined');
    
    if (!genre || !genre.name) {
      console.log("Invalid: no genre or no name");
      return false;
    }
    
    // 空文字列のチェック
    if (genre.name.trim() === '') {
      console.log("Invalid: name is empty");
      return false;
    }
    
    // MyString、MyTextなどのデフォルト値や不正なデータをチェック
    const invalidPatterns = ['MyString', 'MyText'];
    
    for (const pattern of invalidPatterns) {
      if (genre.name.includes(pattern)) {
        console.log(`Invalid: name contains pattern "${pattern}"`);
        return false;
      }
      if (genre.description && genre.description.includes(pattern)) {
        console.log(`Invalid: description contains pattern "${pattern}"`);
        return false;
      }
    }
    
    console.log("Data is valid:", genre.name);
    return true;
  };

  // 個別のボタン用のデータを取得する関数
  const fetchSingleGenre = async (buttonKey) => {
    try {
      const response = await fetch("/api/v1/food_genres/random");
      const data = await response.json();
      
      if (data.error) {
        console.error("API Error:", data.error);
        return null;
      }
      
      if (isValidData(data)) {
        return data;
      } else {
        console.warn("Invalid data received:", data);
        return null;
      }
    } catch (err) {
      console.error("Error fetching single genre:", err);
      return null;
    }
  };

  // 不正なデータを自動的に再取得する関数
  const autoRetryInvalidData = async () => {
    const maxRetries = 3;
    let hasChanges = false;
    
    console.log("Auto retry check - current pair:", pair);
    console.log("Auto retry counts:", autoRetryCount);
    
    for (let i = 0; i < pair.length; i++) {
      const buttonKey = buttonKeys[i];
      const currentData = pair[i];
      
      console.log(`Checking ${buttonKey}:`, currentData);
      
      if (currentData && !isValidData(currentData)) {
        const retryCount = autoRetryCount[buttonKey] || 0;
        
        console.log(`${buttonKey} is invalid, retry count: ${retryCount}`);
        
        if (retryCount < maxRetries) {
          console.log(`Auto retrying invalid data for ${buttonKey}, attempt ${retryCount + 1}`);
          
          const newData = await fetchSingleGenre(buttonKey);
          console.log(`New data for ${buttonKey}:`, newData);
          
          if (newData && isValidData(newData)) {
            console.log(`Successfully got valid data for ${buttonKey}:`, newData.name);
            setPair(prev => {
              const newPair = [...prev];
              // 実際に変更があった場合のみ更新
              if (JSON.stringify(newPair[i]) !== JSON.stringify(newData)) {
                newPair[i] = newData;
                console.log(`Updated pair for ${buttonKey}`);
                return newPair;
              } else {
                console.log(`No change needed for ${buttonKey}`);
                return prev;
              }
            });
            hasChanges = true;
          } else {
            console.log(`Failed to get valid data for ${buttonKey}`);
          }
          
          setAutoRetryCount(prev => ({
            ...prev,
            [buttonKey]: retryCount + 1
          }));
        } else {
          console.log(`Max retries reached for ${buttonKey}`);
        }
      } else {
        console.log(`${buttonKey} is valid or null`);
      }
    }
    
    console.log("Auto retry completed, hasChanges:", hasChanges);
    return hasChanges;
  };

  // pairの変更を監視して、不正なデータがあれば自動的に再取得
  useEffect(() => {
    console.log("useEffect triggered - pair changed:", pair);
    
    // 前回と同じ値の場合はスキップ
    if (JSON.stringify(prevPairRef.current) === JSON.stringify(pair)) {
      console.log("Pair unchanged, skipping");
      return;
    }
    
    prevPairRef.current = pair;
    
    if (pair.length > 0) {
      const hasInvalidData = pair.some(data => data && !isValidData(data));
      
      console.log("Has invalid data:", hasInvalidData);
      
      if (hasInvalidData) {
        console.log("Setting up auto retry timer");
        // 少し遅延を入れてから再取得（無限ループを防ぐ）
        const timer = setTimeout(() => {
          console.log("Auto retry timer fired");
          autoRetryInvalidData();
        }, 1000);
        
        return () => {
          console.log("Clearing auto retry timer");
          clearTimeout(timer);
        };
      } else {
        console.log("No invalid data found, no retry needed");
      }
    }
  }, [pair]);



  const fetchPair = async () => {
    setLoading(true);
    setError(null);
    // 自動再試行回数をリセット
    setAutoRetryCount({ left: 0, right: 0 });
    
    try {
      const response = await fetch("/api/v1/food_genres/two_random");
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (Array.isArray(data) && data.length === 2) {
        // データの検証を行う
        const validData = data.filter(isValidData);
        
        if (validData.length === 2) {
          setPair(validData);
        } else {
          // 不正なデータがある場合は、個別に再取得を試みる
          const newPair = [];
          for (let i = 0; i < 2; i++) {
            if (isValidData(data[i])) {
              newPair[i] = data[i];
            } else {
              // 不正なデータの場合は再取得
              const retryData = await fetchSingleGenre(buttonKeys[i]);
              newPair[i] = retryData || data[i]; // 再取得に失敗した場合は元のデータを使用
            }
          }
          setPair(newPair);
        }
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

  // もう一度ボタンが押された時の処理
  const handleReset = () => {
    setHistory({}); // 履歴をリセット
    fetchPair(); // 新しいペアを取得
  };

  // 履歴を配列に変換して回数順にソート
  const sortedHistory = Object.values(history).sort(
    (a, b) => b.count - a.count
  );
  const totalCount = sortedHistory.reduce((sum, item) => sum + item.count, 0);
  const mostSelected = sortedHistory[0]?.genre;

  return (
    <RippleEffect>
      <ChakraProvider theme={theme}>
        {/* 全体の背景色を設定 */}
        <Box
          minH="100vh"
          bg={bgColor}
          color={textColor}
          style={{
            backgroundColor: colorMode === "dark" ? "#1a202c" : "#ffffff",
            color: colorMode === "dark" ? "#ffffff" : "#1a202c"
          }}
        >
          {/* 設定ボタン（右上固定） */}
          <Box position="fixed" top={4} right={4} zIndex={1000}>
            <IconButton
              icon={<FiSettings />}
              aria-label="設定"
              variant="outline"
              size="lg"
              onClick={onOpen}
              bg={colorMode === "dark" ? "gray.800" : "white"}
              color={colorMode === "dark" ? "white" : "gray.800"}
              borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
              style={{ userSelect: "none" }}
              _hover={{
                bg: colorMode === "dark" ? "gray.700" : "gray.50",
                borderColor: colorMode === "dark" ? "gray.500" : "gray.400"
              }}
            />
          </Box>

          {/* 設定モーダル */}
          <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent
              bg={colorMode === "dark" ? "gray.800" : "white"}
              color={colorMode === "dark" ? "white" : "gray.800"}
            >
              <ModalHeader style={{ userSelect: "none" }}>設定</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="md" mb={4} style={{ userSelect: "none" }}>カラーモード</Heading>
                    <Checkbox 
                      isChecked={isSystemMode}
                      onChange={(e) => handleSystemModeChange(e.target.checked)}
                      color={colorMode === "dark" ? "white" : "gray.800"}
                      style={{ userSelect: "none" }}
                      sx={{
                        '& .chakra-checkbox__control': {
                          borderColor: colorMode === "dark" ? "gray.600" : "gray.300",
                          bg: colorMode === "dark" ? "gray.800" : "white"
                        },
                        '& .chakra-checkbox__control[data-checked]': {
                          bg: colorMode === "dark" ? "blue.500" : "blue.500",
                          borderColor: colorMode === "dark" ? "blue.500" : "blue.500"
                        }
                      }}
                    >
                      システム
                    </Checkbox>
                    <Box mt={3} ml={6}>
                      <RadioGroup 
                        value={manualColorMode} 
                        onChange={handleManualColorModeChange}
                        isDisabled={isSystemMode}
                      >
                        <Stack direction="row" spacing={4}>
                          <Radio 
                            value="light" 
                            color={colorMode === "dark" ? "white" : "gray.800"}
                            borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                            bg={colorMode === "dark" ? "gray.800" : "white"}
                            style={{ userSelect: "none" }}
                            sx={{
                              '& .chakra-radio__control': {
                                borderColor: colorMode === "dark" ? "gray.600" : "gray.300",
                                bg: colorMode === "dark" ? "gray.800" : "white",
                                borderWidth: "1px"
                              },
                              '& .chakra-radio__control[data-checked]': {
                                bg: colorMode === "dark" ? "blue.500" : "blue.500",
                                borderColor: colorMode === "dark" ? "blue.500" : "blue.500"
                              }
                            }}
                          >
                            ライト
                          </Radio>
                          <Radio 
                            value="dark" 
                            color={colorMode === "dark" ? "white" : "gray.800"}
                            borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                            bg={colorMode === "dark" ? "gray.800" : "white"}
                            style={{ userSelect: "none" }}
                            sx={{
                              '& .chakra-radio__control': {
                                borderColor: colorMode === "dark" ? "gray.600" : "gray.300",
                                bg: colorMode === "dark" ? "gray.800" : "white",
                                borderWidth: "1px"
                              },
                              '& .chakra-radio__control[data-checked]': {
                                bg: colorMode === "dark" ? "blue.500" : "blue.500",
                                borderColor: colorMode === "dark" ? "blue.500" : "blue.500"
                              }
                            }}
                          >
                            ダーク
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </Box>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Box p={6} maxW="600px" mx="auto">
            <VStack spacing={6} align="stretch">
              <Heading size="lg" textAlign="center" style={{ userSelect: "none" }}>
                外食何食べる？
              </Heading>

              {totalCount >= 20 ? (
                <Box textAlign="center" mt={10}>
                  <Heading size="lg" color="teal.600" style={{ userSelect: "none" }}>
                    {mostSelected
                      ? `${mostSelected.name}を食べるのはどうですか？`
                      : "ジャンルが選ばれていません"}
                  </Heading>
                  <MotionButton
                    colorScheme="teal"
                    size="lg"
                    onClick={handleReset}
                    mt={6}
                    style={{ userSelect: "none" }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    もう一度
                  </MotionButton>
                </Box>
              ) : (
                <>
                  {/* {loading && <Text>読み込み中...</Text>} */}
                  {/* リロードマークを削除 - ボタンに重ねて表示するため */}

                  {error && (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertTitle>エラー</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* ボタンは常に表示 */}
                  <HStack spacing={8} justify="center" position="relative">
                    {buttonKeys.map((key, index) => (
                      <Box key={key} position="relative">
                        <MotionButton
                          colorScheme="teal"
                          size="lg"
                          onClick={() => pair[index] && handleSelect(pair[index])}
                          w="160px"
                          h="80px"
                          p={4}
                          style={{ userSelect: "none" }}
                          whileTap={{ scale: 0.92 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          isDisabled={!pair[index] || loading}
                        >
                          <VStack spacing={1}>
                            <Text 
                              fontWeight="bold" 
                              fontSize="lg" 
                              style={{ userSelect: "none" }}
                              noOfLines={2}
                              textAlign="center"
                            >
                              {pair[index]?.name || "読み込み中..."}
                            </Text>
                            {pair[index]?.description && (
                              <Text 
                                color={colorMode === "dark" ? "gray.300" : "gray.600"} 
                                fontSize="sm" 
                                style={{ userSelect: "none" }}
                                noOfLines={1}
                                textAlign="center"
                              >
                                {pair[index].description}
                              </Text>
                            )}
                          </VStack>
                        </MotionButton>
                        {/* ローディングオーバーレイ */}
                        {loading && (
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            zIndex={10}
                            bg="rgba(0, 0, 0, 0.5)"
                            borderRadius="md"
                            p={2}
                          >
                            <Spinner size="sm" color="white" />
                          </Box>
                        )}
                      </Box>
                    ))}
                  </HStack>
                  
                  {/* デバッグ情報 */}
                  {/* <Box mt={4} p={2} bg="gray.100" borderRadius="md">
                    <Text fontSize="sm">
                      Debug: loading={loading.toString()}, error={error?.toString() || 'null'}, pair.length={pair.length}
                    </Text>
                  </Box> */}

                  {/* ここに「どちらでもない」ボタンを追加 */}
                  <Box textAlign="center" mt={4}>
                    <MotionButton
                      bg={colorMode === "dark" ? "gray.800" : "white"}
                      color={colorMode === "dark" ? "white" : "gray.800"}
                      borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
                      borderWidth="1px"
                      variant="outline"
                      size="md"
                      onClick={fetchPair}
                      style={{ userSelect: "none" }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      _hover={{
                        bg: colorMode === "dark" ? "gray.700" : "gray.50",
                        borderColor: colorMode === "dark" ? "gray.500" : "gray.400"
                      }}
                    >
                      どちらでもない
                    </MotionButton>
                  </Box>

                  {/* 選択履歴の表示（回数順） */}
                  {sortedHistory.length > 0 && (
                    <>
                      <Heading size="md" mb={2} style={{ userSelect: "none" }}>
                        選択履歴（選ばれた回数順）
                      </Heading>
                      <List spacing={2}>
                        {sortedHistory.map(({ genre, count }) => (
                          <ListItem key={genre.id}>
                            <Text style={{ userSelect: "none" }}>
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
        </Box>
      </ChakraProvider>
    </RippleEffect>
  );
};

export default App;

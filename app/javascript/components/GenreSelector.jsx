// app/javascript/components/GenreSelector.jsx

import React from 'react';
// Chakra UIの使いたい部品をインポート
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';

const GenreSelector = () => {
  return (
    <VStack spacing={8} p={10}>
      <Text fontSize="2xl">どっちの気分？</Text>
      <HStack spacing={4}>
        <Button colorScheme="teal" size="lg" height="100px" width="150px">
          中華
        </Button>
        <Button colorScheme="purple" size="lg" height="100px" width="150px">
          イタリアン
        </Button>
      </HStack>
    </VStack>
  );
};

export default GenreSelector;

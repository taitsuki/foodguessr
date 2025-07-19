// app/javascript/react_app.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import GenreSelector from './components/GenreSelector';

// Reactコンポーネントを描画する関数を定義
const renderApp = () => {
  const container = document.getElementById('react-app');
  if (container) {
    // 既に描画済みの場合は何もしない（二重描画を防ぐ）
    if (container.hasChildNodes()) {
      return;
    }
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ChakraProvider>
          <GenreSelector />
        </ChakraProvider>
      </React.StrictMode>
    );
  }
};

// Turbo Driveのページ読み込み完了イベントを監視する
document.addEventListener('turbo:load', renderApp);

// ブラウザの通常のリロードにも対応するために、こちらも残しておく
document.addEventListener('DOMContentLoaded', renderApp);

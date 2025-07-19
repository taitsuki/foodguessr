import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("application.js is loading!"); // ★これを追加

// async function enableMocking() {
//   console.log("enableMocking function called!"); // ★これを追加

//   console.log("Importing MSW worker..."); // ★これを追加
//   // MSWを起動させるためのファイルをインポート
//   const { worker } = await import("./mocks/browser");

//   console.log("Starting MSW worker..."); // ★これを追加
//   // MSWを起動
//   return worker.start();
// }

// // 上記の関数を実行し、完了したらアプリの他の処理を開始
// enableMocking().then(() => {
//   console.log("MSW enabled!");

//   // ここからReactアプリのマウント処理
//   const container = document.getElementById("root");
//   if (container) {
//     const root = createRoot(container);
//     root.render(<App />);
//   }
// });

// MSWを無効化してReactアプリのみを起動
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

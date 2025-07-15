import { http, HttpResponse } from 'msw'

// 選択肢となるジャンルの一覧
const allGenres = [
  '和食', '中華', 'イタリアン', 'フレンチ', '焼肉',
  '寿司', 'ラーメン', 'カレー', 'アジア・エスニック', '居酒屋'
];

export const handlers = [
  // '/api/genres/random-pair' へのGETリクエストを横取りする
  http.get('/api/genres/random-pair', () => {
    // 一覧から、重複しないようにランダムで2つのジャンルを選ぶ
    let genreA, genreB;
    genreA = allGenres[Math.floor(Math.random() * allGenres.length)];
    do {
      genreB = allGenres[Math.floor(Math.random() * allGenres.length)];
    } while (genreA === genreB); // もし同じだったら選び直す

    // 偽のJSONレスポンスを返す
    return HttpResponse.json({
      genreA: genreA,
      genreB: genreB,
    })
  }),
]

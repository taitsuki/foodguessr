# FoodGuessr

Rails 8.0.2 と esbuild を使用した Web アプリケーションです。

## 必要な環境

- Docker
- Docker Compose

## セットアップ(バックエンド編)

前提として、[Docker Desktop](https://www.docker.com/ja-jp/products/docker-desktop/) がインストールされている必要があります。

### 1. リポジトリのクローン

```bash
git clone git@github.com:taitsuki/foodguessr.git
cd foodguessr
```

### 2\. アプリケーションのビルドと起動

以下のコマンドで、Rails サーバーと JavaScript のビルドプロセスが同時に起動します。

```bash
# 初回起動（ビルド含む）
docker-compose up --build

# 2回目以降の起動
docker-compose up
```

### 3\. データベースのセットアップ（初回のみ）

アプリケーションとは**別のターミナルを開いて**、以下のコマンドを実行してください。

```bash
docker-compose run --rm web bundle exec rails db:create db:migrate
```

以下のコマンドで DB 内にデータを投入できます。

```bash
# seedの投入
docker-compose exec web bin/rails db:seed

# rails consoleに入ってDBの確認
docker-compose exec web bin/rails console

# rails console内で以下を実行
FoodGenre.all
```

### 4\. アプリケーションにアクセス

ブラウザで `http://localhost:3000` にアクセス

## セットアップ(フロントエンド編)

### React + Chakra UI の導入

このプロジェクトでは **jsbundling-rails** と **esbuild** を使用して React + Chakra UI を導入しています。

#### 初回セットアップ（新規開発者の場合）

1. **依存関係のインストール**

   ```bash
   docker-compose exec web npm install
   ```

2. **Chakra UI 関連パッケージのインストール**

   ```bash
   docker-compose exec web npm install @chakra-ui/react@2.8.2 @emotion/react@11.11.1 @emotion/styled@11.11.0 framer-motion@latest
   ```

3. **フロントエンドのビルド**
   ```bash
   docker-compose exec web npm run build
   ```

#### 既存開発者の場合

新しい npm パッケージが追加された場合は、以下を実行してください：

```bash
docker-compose exec web npm install
docker-compose exec web npm run build
```

#### フロントエンドの開発

- **React コンポーネント**: `app/javascript/` 配下に配置
- **エントリーポイント**: `app/javascript/application.js`
- **ビルド出力**: `app/assets/builds/` 配下に生成

## 開発

### アプリケーションの停止

```bash
docker-compose down
```

### ログの確認

`docker-compose up` を実行しているターミナルに、Rails(`web`)と JavaScript(`js`)の両方のログが出力されます。

### Docker 内でのコマンド実行

```bash
# webコンテナに入る
docker-compose exec web bash
```

### Rails 関連のコマンド実行

Rails コンソールやデータベースコンソールなど、単発のコマンドを実行する場合は、**別のターミナルを開いて**以下のコマンドを実行してください。

```bash
# Rails コンソール
docker-compose run --rm web bundle exec rails console

# データベースコンソール
docker-compose run --rm web bundle exec rails dbconsole

# テストの実行
docker-compose run --rm web bundle exec rails test
```

```bash
# Rails コンソールは以下コマンドでも起動可能
docker-compose exec web bin/rails console
```

## サービス構成

- **Rails**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

## API エンドポイント

- **ジャンル一覧**: `GET /api/v1/food_genres`
- **ジャンル詳細**: `GET /api/v1/food_genres/:id`
- **ジャンルのランダム取得(1 つ)**: `GET /api/v1/food_genres/random`
- **ジャンルのランダム取得(2 つ)**: `GET /api/v1/food_genres/two_random`

## トラブルシューティング

### PID ファイルエラーが発生した場合

現在は bin/dev を使うため、このエラーは発生しにくいが、build エラーを解消した後に必要になる場合がある

```bash
docker-compose run web rm -f tmp/pids/server.pid
docker-compose up

#上記でうまくいかない場合、ルートディレクトリで以下を実行
rm -f tmp/pids/server.pid
```

### Gem の依存関係エラーが発生した場合

```bash
# キャッシュを使わずに再ビルドする
docker-compose build --no-cache
```

```bash
# 手動でGemをインストールする
docker-compose run --rm web bundle install
```

### JavaScript の依存関係エラーが発生した場合

```bash
rm -rf node_modules package-lock.json
docker-compose run --rm web npm install
```

### Chakra UI のエラーが発生した場合

```bash
# 依存関係を完全にクリア
docker-compose exec web rm -rf node_modules package-lock.json
docker-compose exec web npm cache clean --force

# 再インストール
docker-compose exec web npm install
docker-compose exec web npm install @chakra-ui/react@2.8.2 @emotion/react@11.11.1 @emotion/styled@11.11.0 framer-motion@latest
docker-compose exec web npm run build
```

## 技術スタック

- **Ruby**: 3.4.4
- **Rails**: 8.0.2
- **JavaScript**: esbuild, MSW (Mock Service Worker)
- **データベース**: PostgreSQL 15
- **キャッシュ**: Redis 7
- **Web サーバー**: Puma

## 開発チーム向け

### 初回セットアップ時の注意点

1.  Docker と Docker Compose がインストールされていることを確認
2.  初回起動時はビルドに時間がかかります（5-10 分程度）
3.  データベースのマイグレーションは、別のターミナルから手動で実行が必要です。

### 日常的な開発フロー

1.  `docker-compose up` でアプリケーションを起動します。
2.  コードを編集すると、Rails と JavaScript の両方が自動でリロード・再ビルドされます。
3.  必要に応じて `docker-compose down` で停止します。

### ファイルの変更について

- **アプリケーションコード (Ruby/JS)**: 自動でリロード・再ビルドされます。
- **`Gemfile` の変更時**: `docker-compose build` を実行して、Docker イメージを再構築してください。
- **`package.json` の変更時**: `docker-compose run --rm web npm install` を実行した後、`docker-compose up` で再起動してください。

<!-- end list -->

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

## デプロイ（Render）

このアプリケーションは Render でデプロイすることを想定しています。

### デプロイ構成

1. **PostgreSQL データベース** (Render PostgreSQL)
   - 専用のPostgreSQLサービス
   - 自動バックアップ機能

2. **Web サービス** (Render Web Service)
   - Railsアプリケーション
   - Dockerコンテナとしてデプロイ

### デプロイ手順

#### 1. Render アカウントの準備

1. [Render](https://render.com/) にアカウントを作成
2. GitHubリポジトリと連携

#### 2. PostgreSQL データベースの作成

1. Render ダッシュボードで「New +」→「PostgreSQL」
2. 以下の設定で作成：
   - **Name**: `foodguessr-db`
   - **Database**: `foodguessr_production`
   - **User**: 自動生成
   - **Region**: 最寄りのリージョン

#### 3. Web サービスの作成

1. Render ダッシュボードで「New +」→「Web Service」
2. GitHubリポジトリを選択
3. 以下の設定で作成：
   - **Name**: `foodguessr`
   - **Environment**: `Docker`
   - **Region**: データベースと同じリージョン
   - **Branch**: `main`
   - **Root Directory**: 空白（ルートディレクトリ）

#### 4. 環境変数の設定

Web サービスで以下の環境変数を設定：

```
RAILS_ENV=production
RAILS_MASTER_KEY=<config/master.keyの内容>
DATABASE_URL=<PostgreSQLの接続URL>
RAILS_SERVE_STATIC_FILES=true
RAILS_LOG_TO_STDOUT=true
```

#### 5. デプロイの実行

1. 設定完了後、自動的にデプロイが開始
2. 初回デプロイ時にデータベースマイグレーションが実行される
3. デプロイ完了後、提供されたURLでアクセス可能

### 本番環境での注意事項

- 静的ファイルは `RAILS_SERVE_STATIC_FILES=true` で配信
- ログは `RAILS_LOG_TO_STDOUT=true` で標準出力に出力
- データベース接続は `DATABASE_URL` 環境変数で管理
- SSLは自動的に有効化される

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

### カラーモードが正しく動作しない場合

```bash
# ブラウザのキャッシュをクリア
# Chrome: Ctrl+Shift+R (Windows/Linux) または Cmd+Shift+R (Mac)
```

### Render デプロイ時のエラー

#### データベース接続エラー

1. `DATABASE_URL` 環境変数が正しく設定されているか確認
2. PostgreSQL サービスが起動しているか確認
3. データベースマイグレーションが実行されているか確認

#### アセットビルドエラー

1. `npm run build` が正常に実行されるかローカルで確認
2. `package.json` と `package-lock.json` が最新か確認

#### メモリ不足エラー

1. Render のプランをアップグレード
2. 不要な依存関係を削除
3. アセットの最適化を検討

## カラーモード機能

このアプリケーションには以下のカラーモード機能が実装されています：

### 機能概要

- **ダークモード/ライトモード切り替え**: 手動での色テーマ切り替え
- **システムカラーモード同期**: OSの設定に自動で合わせる
- **設定の永続化**: ブラウザを閉じても設定が保持される
- **統一されたUI**: ボタン、テキスト、背景色が一貫したデザイン

### 使用方法

1. **設定ボタン**: 画面右上の設定アイコンをタップ
2. **カラーモード選択**:
   - **システム**: OSの設定に合わせる（推奨）
   - **ライト**: 常にライトモード
   - **ダーク**: 常にダークモード

### 技術仕様

- **状態管理**: React useState + localStorage
- **システム検知**: `prefers-color-scheme` メディアクエリ
- **永続化**: localStorage API
- **UI ライブラリ**: Chakra UI + Framer Motion

### トラブルシューティング

#### カラーモードが切り替わらない場合

1. ブラウザのキャッシュをクリア
2. 設定を「システム」に戻してから再選択
3. ブラウザの開発者ツールでlocalStorageを確認

#### システムカラーモードが検知されない場合

1. OSのカラーモード設定を確認
2. ブラウザの設定でカラーモードが無効になっていないか確認
3. 一度「ライト」または「ダーク」に設定してから「システム」に戻す

## 技術スタック

- **バックエンド**: Rails 8.0.2
- **フロントエンド**: React + Chakra UI + Framer Motion
- **データベース**: PostgreSQL
- **アセットビルド**: esbuild
- **コンテナ**: Docker
- **デプロイ**: Render
- **開発環境**: Docker Compose

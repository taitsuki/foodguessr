# FoodGuessr

Rails 8.0.2 を使用した Web アプリケーションです。

## 必要な環境

- Docker
- Docker Compose

## セットアップ

前提として、Docker Desktop がインストールされている必要があります。
https://www.docker.com/ja-jp/products/docker-desktop/

### 1. リポジトリのクローン

```bash
git clone git@github.com:taitsuki/foodguessr.git
cd foodguessr
```

### 2. アプリケーションの起動

```bash
# 初回起動（ビルド含む）
docker-compose up --build

# 2回目以降の起動
docker-compose up
```

### 3. データベースのセットアップ（初回のみ）

```bash
# 別ターミナルで実行
docker-compose run web bundle exec rails db:create db:migrate
```

### 4. アプリケーションにアクセス

ブラウザで `http://localhost:3000` にアクセス

## 開発

### アプリケーションの停止

```bash
docker-compose down
```

### ログの確認

```bash
# 全サービスのログ
docker-compose logs

# Railsアプリケーションのログのみ
docker-compose logs -f web
```

### Rails コンソール

```bash
docker-compose run web bundle exec rails console
```

### データベースコンソール

```bash
docker-compose run web bundle exec rails dbconsole
```

### テストの実行

```bash
docker-compose run web bundle exec rails test
```

## サービス構成

- **Rails**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

## トラブルシューティング

### PID ファイルエラーが発生した場合

```bash
docker-compose run web rm -f tmp/pids/server.pid
docker-compose up
```

### Gem の依存関係エラーが発生した場合

```bash
docker-compose down
docker-compose up --build
```

## 技術スタック

- **Ruby**: 3.4.4
- **Rails**: 8.0.2
- **データベース**: PostgreSQL 15
- **キャッシュ**: Redis 7
- **Web サーバー**: Puma

## 開発チーム向け

### 初回セットアップ時の注意点

1. Docker と Docker Compose がインストールされていることを確認
2. 初回起動時はビルドに時間がかかります（5-10 分程度）
3. データベースのマイグレーションは手動で実行が必要

### 日常的な開発フロー

1. `docker-compose up` でアプリケーション起動
2. コードを編集（ホットリロード対応）
3. 必要に応じて `docker-compose down` で停止

### ファイルの変更について

- アプリケーションコードはホットリロード対応
- Gemfile の変更時は `docker-compose up --build` が必要
- データベース設定の変更時はコンテナの再起動が必要

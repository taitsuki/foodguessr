FoodGuessr
Rails 8.0.2 と esbuild を使用した Web アプリケーションです。

必要な環境
Docker

Docker Compose

セットアップ
前提として、Docker Desktop がインストールされている必要があります。
https://www.docker.com/ja-jp/products/docker-desktop/

1. リポジトリのクローン
git clone git@github.com:taitsuki/foodguessr.git
cd foodguessr

2. アプリケーションの起動
以下のコマンドで、RailsサーバーとJavaScriptのビルドプロセスが同時に起動します。

# 初回起動（ビルド含む）
docker-compose up --build

# 2回目以降の起動
docker-compose up

3. データベースのセットアップ（初回のみ）
アプリケーションとは別のターミナルを開いて、以下のコマンドを実行してください。

docker-compose run --rm web bundle exec rails db:create db:migrate

4. アプリケーションにアクセス
ブラウザで http://localhost:3000 にアクセス

開発
アプリケーションの停止
docker-compose down

ログの確認
docker-compose up を実行しているターミナルに、Rails(web)とJavaScript(js)の両方のログが出力されます。

Rails関連のコマンド実行
Railsコンソールやデータベースコンソールなど、単発のコマンドを実行する場合は、別のターミナルを開いて以下のコマンドを実行してください。

# Rails コンソール
docker-compose run --rm web bundle exec rails console

# データベースコンソール
docker-compose run --rm web bundle exec rails dbconsole

# テストの実行
docker-compose run --rm web bundle exec rails test

サービス構成
Rails: http://localhost:3000

PostgreSQL: localhost:5432

Redis: localhost:6379

トラブルシューティング
PID ファイルエラーが発生した場合
# docker-compose run web rm -f tmp/pids/server.pid
# docker-compose up
# (現在は bin/dev を使うため、このエラーは発生しにくくなっています)

Gem の依存関係エラーが発生した場合
docker-compose build --no-cache

JavaScript の依存関係エラーが発生した場合
rm -rf node_modules package-lock.json
docker-compose run --rm web npm install

技術スタック
Ruby: 3.4.4

Rails: 8.0.2

JavaScript: esbuild, MSW (Mock Service Worker)

データベース: PostgreSQL 15

キャッシュ: Redis 7

Web サーバー: Puma

開発チーム向け
初回セットアップ時の注意点
Docker と Docker Compose がインストールされていることを確認

初回起動時はビルドに時間がかかります（5-10 分程度）

データベースのマイグレーションは、別のターミナルから手動で実行が必要です。

日常的な開発フロー
docker-compose up でアプリケーションを起動します。

コードを編集すると、RailsとJavaScriptの両方が自動でリロード・再ビルドされます。

必要に応じて docker-compose down で停止します。

ファイルの変更について
アプリケーションコード (Ruby/JS): 自動でリロード・再ビルドされます。

Gemfile の変更時: docker-compose build を実行して、Dockerイメージを再構築してください。

package.json の変更時: docker-compose run --rm web npm install を実行した後、docker-compose up で再起動してください。

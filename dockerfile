# Ruby 3.4.4を使用
FROM ruby:3.4.4

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# GemfileとGemfile.lockをコピー
COPY Gemfile ./
COPY Gemfile.lock ./

# Bundlerを最新版に更新して依存関係をインストール
RUN gem install bundler
RUN bundle install

# package.jsonとpackage-lock.jsonをコピー
COPY package.json ./
COPY package-lock.json ./

# npmパッケージをインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# 本番環境用のアセットをビルド
RUN npm run build

# Railsの実行可能ファイルを確実にインストール
RUN bundle exec rails --version

# 本番環境用の設定
ENV RAILS_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true

# ポート3000を公開
EXPOSE 3000

# 本番環境用のコマンド
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
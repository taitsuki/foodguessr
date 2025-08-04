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

# アプリケーションのソースコードをコピー
COPY . .

# entrypoint.shに実行権限を付与
COPY bin/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# エントリーポイントを設定
ENTRYPOINT ["entrypoint.sh"]

# Railsの実行可能ファイルを確実にインストール
RUN bundle exec rails --version

# ポート3000を公開
EXPOSE 3000

# 本番環境用のWebサーバーを起動
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
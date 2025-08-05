#!/bin/sh
set -e

# Rails DBマイグレーションを実行
bundle exec rails db:migrate

# 初期データを投入
bundle exec rails db:seed

# その後、DockerfileのCMDで渡されたコマンドを実行
exec "$@"

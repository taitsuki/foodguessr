#!/bin/sh
set -e

# Rails DBマイグレーションを実行
bundle exec rails db:migrate

# その後、DockerfileのCMDで渡されたコマンドを実行
exec "$@"

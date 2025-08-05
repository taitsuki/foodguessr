# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# データを重複させずに作成するため、find_or_create_by! を使用します。
# これにより、このスクリプトを何度実行しても安全になります。
[
  "寿司", "天ぷら", "そば", "うどん", "ラーメン", "定食", "焼鳥", "お好み焼き", "たこ焼き",
  "とんかつ", "パスタ", "ピザ", "ハンバーガー", "ステーキ", "ハンバーグ", "炒飯", "餃子",
  "焼肉", "スイーツ", "パン", "サンドイッチ", "カレー", "チキン", "丼もの"
].each do |genre_name|
  FoodGenre.find_or_create_by!(name: genre_name)
end

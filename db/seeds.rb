# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# FoodGenre.delete_all # DB内容を削除しリセット
# ActiveRecord::Base.connection.reset_pk_sequence!('food_genres') # シーケンスをリセットし、id:1スタートに
FoodGenre.create(name: "寿司")
FoodGenre.create(name: "天ぷら")
FoodGenre.create(name: "蕎麦")
FoodGenre.create(name: "うどん")
FoodGenre.create(name: "ラーメン")
FoodGenre.create(name: "居酒屋")
FoodGenre.create(name: "定食・食堂")
FoodGenre.create(name: "焼鳥")
FoodGenre.create(name: "お好み焼き")
FoodGenre.create(name: "たこ焼き")
FoodGenre.create(name: "とんかつ")
FoodGenre.create(name: "うなぎ")
FoodGenre.create(name: "鍋")
FoodGenre.create(name: "パスタ")
FoodGenre.create(name: "ピザ")
FoodGenre.create(name: "フレンチ")
FoodGenre.create(name: "ハンバーガー")
FoodGenre.create(name: "ステーキ")
FoodGenre.create(name: "パエリア")
FoodGenre.create(name: "炒飯")
FoodGenre.create(name: "餃子")
FoodGenre.create(name: "焼肉")
FoodGenre.create(name: "チゲ")
FoodGenre.create(name: "パンケーキ")
FoodGenre.create(name: "スイーツ")
FoodGenre.create(name: "パン")
FoodGenre.create(name: "サンドイッチ")
FoodGenre.create(name: "カレー")
FoodGenre.create(name: "チキン")

class FixInvalidFoodGenres < ActiveRecord::Migration[8.0]
  def up
    # MyString、MyTextなどの不正なデータを削除
    FoodGenre.where("name LIKE '%MyString%' OR name LIKE '%MyText%' OR name IS NULL OR name = ''").destroy_all
    # descriptionが不正なデータも修正
    FoodGenre.where("description LIKE '%MyString%' OR description LIKE '%MyText%'").update_all(description: nil)
    # データが存在しない場合は、基本的なデータを追加
    if FoodGenre.count == 0
      FoodGenre.create(name: "寿司")
      FoodGenre.create(name: "天ぷら")
      FoodGenre.create(name: "そば")
      FoodGenre.create(name: "うどん")
      FoodGenre.create(name: "ラーメン")
      FoodGenre.create(name: "定食")
      FoodGenre.create(name: "焼鳥")
      FoodGenre.create(name: "お好み焼き")
      FoodGenre.create(name: "たこ焼き")
      FoodGenre.create(name: "とんかつ")
      FoodGenre.create(name: "パスタ")
      FoodGenre.create(name: "ピザ")
      FoodGenre.create(name: "ハンバーガー")
      FoodGenre.create(name: "ステーキ")
      FoodGenre.create(name: "ハンバーグ")
      FoodGenre.create(name: "炒飯")
      FoodGenre.create(name: "餃子")
      FoodGenre.create(name: "焼肉")
      FoodGenre.create(name: "スイーツ")
      FoodGenre.create(name: "パン")
      FoodGenre.create(name: "サンドイッチ")
      FoodGenre.create(name: "カレー")
      FoodGenre.create(name: "チキン")
      FoodGenre.create(name: "丼もの")
    end
  end
  def down
    # このマイグレーションは元に戻せない（データ削除のため）
  end
end


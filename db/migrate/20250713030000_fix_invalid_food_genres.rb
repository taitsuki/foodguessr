class FixInvalidFoodGenres < ActiveRecord::Migration[8.0]
  def up
    # MyString、MyTextなどの不正なデータを削除
    FoodGenre.where("name LIKE '%MyString%' OR name LIKE '%MyText%' OR name IS NULL OR name = ''").destroy_all
    # descriptionが不正なデータも修正
    FoodGenre.where("description LIKE '%MyString%' OR description LIKE '%MyText%'").update_all(description: nil)
    # データが存在しない場合は、基本的なデータを追加
    return unless FoodGenre.count.zero?
    basic_food_genres.each { |name| FoodGenre.create(name: name) }
end
  def down
    # このマイグレーションは元に戻せない（データ削除のため）
end
private
  def basic_food_genres
    %w[
      寿司 天ぷら そば うどん ラーメン 定食 焼鳥 お好み焼き たこ焼き とんかつ
      パスタ ピザ ハンバーガー ステーキ ハンバーグ 炒飯 餃子 焼肉 スイーツ パン
      サンドイッチ カレー チキン 丼もの
    ]
end
end


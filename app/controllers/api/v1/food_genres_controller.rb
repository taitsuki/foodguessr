class Api::V1::FoodGenresController < ApplicationController
  def index
    food_genres = FoodGenre.all
    render json: food_genres
  end
  def show
    food_genre = FoodGenre.find(params[:id])
    render json: food_genre
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ジャンルが見つかりません" }, status: :not_found
  end
  def random
    food_genre = FoodGenre.order("RANDOM()").first
    if food_genre && valid_food_genre?(food_genre)
      render json: food_genre
    else
      # 不正なデータの場合は再試行
      retry_count = 0
      max_retries = 5
      while retry_count < max_retries
        food_genre = FoodGenre.order("RANDOM()").first
        if food_genre && valid_food_genre?(food_genre)
          render json: food_genre
          return
        end
        retry_count += 1
      end
      render json: { error: "有効なジャンルが見つかりません" }, status: :not_found
    end
  end
  def two_random
    food_genres = FoodGenre.order("RANDOM()").limit(2)
    valid_genres = food_genres.select { |genre| valid_food_genre?(genre) }
    if valid_genres.length == 2
      render json: valid_genres
    else
      # 不足している場合は追加で取得
      remaining_count = 2 - valid_genres.length
      additional_genres = []
      remaining_count.times do
        retry_count = 0
        max_retries = 10
        while retry_count < max_retries
          genre = FoodGenre.order("RANDOM()").first
          if genre && valid_food_genre?(genre) && !valid_genres.include?(genre) && !additional_genres.include?(genre)
            additional_genres << genre
            break
          end
          retry_count += 1
        end
      end
      final_genres = valid_genres + additional_genres
      if final_genres.length == 2
        render json: final_genres
      else
        render json: { error: "有効なジャンルが足りません" }, status: :not_found
      end
    end
  end
  private
  def valid_food_genre?(genre)
    return false unless genre
    return false if genre.name.blank?
    # MyString、MyTextなどの不正なデータをチェック
    invalid_patterns = ["MyString", "MyText", "null", "undefined"]
    return false if invalid_patterns.any? { |pattern| genre.name.include?(pattern) }
    if genre.description.present?
      return false if invalid_patterns.any? { |pattern| genre.description.include?(pattern) }
    end
    true
  end
end


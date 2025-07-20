class Api::V1::FoodGenresController < ApplicationController
  def index
    food_genres = FoodGenre.all
    render json: food_genres
end
  def show
    food_genre = FoodGenre.find(params[:id])
    render json: food_genre
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'ジャンルが見つかりません' }, status: :not_found
end
  def random
    food_genre = find_valid_food_genre
    if food_genre
      render json: food_genre
    else
      render json: { error: '有効なジャンルが見つかりません' }, status: :not_found
end
end
  def two_random
    food_genres = find_two_valid_food_genres
    if food_genres.length == 2
      render json: food_genres
    else
      render json: { error: '有効なジャンルが足りません' }, status: :not_found
end
end
  private
  def find_valid_food_genre
    retry_count = 0
    max_retries = 5
    while retry_count < max_retries
      food_genre = FoodGenre.order('RANDOM()').first
      return food_genre if valid_food_genre?(food_genre)
      retry_count += 1
end
    nil
end
  def find_two_valid_food_genres
    valid_genres = []
    retry_count = 0
    max_retries = 10
    while valid_genres.length < 2 && retry_count < max_retries
      genre = FoodGenre.order('RANDOM()').first
      if valid_food_genre?(genre) && !valid_genres.include?(genre)
        valid_genres << genre
end
      retry_count += 1
end
    valid_genres
end
  def valid_food_genre?(genre)
    return false unless genre
    return false if genre.name.blank?

    invalid_patterns = ['MyString', 'MyText', 'null', 'undefined']
    return false if invalid_patterns.any? { |pattern| genre.name.include?(pattern) }

    if genre.description.present?
      return false if invalid_patterns.any? { |pattern| genre.description.include?(pattern) }
end

    true
end
end


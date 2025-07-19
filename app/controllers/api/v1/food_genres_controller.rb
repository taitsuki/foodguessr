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
    if food_genre
      render json: food_genre
    else
      render json: { error: "ジャンルが見つかりません" }, status: :not_found
    end
  end

  def two_random
    food_genres = FoodGenre.order("RANDOM()").limit(2)
    if food_genres.present?
      render json: food_genres
    else
      render json: { error: "ジャンルが見つかりません" }, status: :not_found
    end
  end
end

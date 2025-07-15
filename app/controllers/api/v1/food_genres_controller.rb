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
end

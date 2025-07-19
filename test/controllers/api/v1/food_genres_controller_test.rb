require "test_helper"

class Api::V1::FoodGenresControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_food_genres_url
    assert_response :success
  end

  test "should get show" do
    # 実際に存在するIDを使用
    food_genre = FoodGenre.first
    get api_v1_food_genre_url(food_genre.id)
    assert_response :success
  end
end

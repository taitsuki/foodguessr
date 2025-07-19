require "test_helper"

class Api::V1::FoodGenresControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_food_genres_url
    assert_response :success
  end

  test "should get show" do
    get api_v1_food_genre_url(1)
    assert_response :success
  end
end

require "test_helper"

class Api::V1::FoodGenresControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_food_genres_index_url
    assert_response :success
  end

  test "should get show" do
    get api_v1_food_genres_show_url
    assert_response :success
  end
end

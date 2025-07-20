Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :food_genres, only: [ :index, :show ] do
        collection do
          get :random
          get :two_random
end
end
end
end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # get "home/index" # この行はあってもなくても良いですが、下のroot設定があれば不要です
  # トップページ("/")にアクセスされたら、HomeControllerのindexアクションを呼び出す
  root "home#index"
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end


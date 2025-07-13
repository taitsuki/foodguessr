class CreateFoodGenres < ActiveRecord::Migration[8.0]
  def change
    create_table :food_genres do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end

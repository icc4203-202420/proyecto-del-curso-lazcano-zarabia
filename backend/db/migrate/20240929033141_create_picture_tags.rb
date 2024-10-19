class CreatePictureTags < ActiveRecord::Migration[7.1]
  def change
    create_table :picture_tags do |t|
      t.references :event_picture, null: false, foreign_key: true, index: true
      t.references :user, null: false, foreign_key: true, index: true
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false

      t.index [:event_picture_id, :user_id], unique: true

    end
  end
end

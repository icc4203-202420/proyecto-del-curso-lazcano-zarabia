class AddVideoToEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :events, :video, :attachment
  end
end

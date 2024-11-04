class RemoveVideoUrlFromEvents < ActiveRecord::Migration[7.1]
  def change
    remove_column :events, :video_url, :string
  end
end

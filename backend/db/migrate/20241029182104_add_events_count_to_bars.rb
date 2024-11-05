class AddEventsCountToBars < ActiveRecord::Migration[7.1]
  def change
    add_column :bars, :events_count, :integer, default: 0, null: false
  end
end

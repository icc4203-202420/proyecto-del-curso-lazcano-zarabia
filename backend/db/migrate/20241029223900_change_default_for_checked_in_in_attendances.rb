class ChangeDefaultForCheckedInInAttendances < ActiveRecord::Migration[7.1]
  def change
    change_column_default :attendances, :checked_in, from: nil, to: true
  end
end

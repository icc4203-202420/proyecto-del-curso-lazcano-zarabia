class ChangeBarIdInFriendshipsToOptional < ActiveRecord::Migration[6.0]
  def change
    change_column_null :friendships, :bar_id, true
  end
end

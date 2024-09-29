class PictureTag < ApplicationRecord
  belongs_to :event_picture
  belongs_to :user

  validates :event_picture_id, presence: true
  validates :user_id, presence: true
end

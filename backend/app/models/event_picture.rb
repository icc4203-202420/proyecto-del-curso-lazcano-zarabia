class EventPicture < ApplicationRecord
  belongs_to :event
  belongs_to :user
  has_many :picture_tags, dependent: :destroy

  has_one_attached :image
end

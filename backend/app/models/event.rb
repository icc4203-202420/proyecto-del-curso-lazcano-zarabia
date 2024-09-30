class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances

  has_many :picture_tags, dependent: :destroy
  has_many :tagged_users, through: :picture_tags, source: :user


  has_many :event_pictures

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end
end

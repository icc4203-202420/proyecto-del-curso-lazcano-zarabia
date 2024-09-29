class Event < ApplicationRecord
  belongs_to :bar
  has_many :attendances
  has_many :users, through: :attendances

  has_many :event_pictures

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end
end

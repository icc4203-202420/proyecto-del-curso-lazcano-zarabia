class Event < ApplicationRecord
  belongs_to :bar, counter_cache: true
  has_many :attendances
  has_many :users, through: :attendances

  has_many :picture_tags, dependent: :destroy
  has_many :tagged_users, through: :picture_tags, source: :user

  has_many :event_pictures

  has_one_attached :video

  def picture_urls
    event_pictures.map do |event_picture|
      Rails.application.routes.url_helpers.url_for(event_picture.image) if event_picture.image.attached?
    end.compact
  end

  def thumbnail
    flyer.variant(resize_to_limit: [200, nil]).processed
  end
end

class GenerateEventSummaryJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find(event_id)
    images = event.event_pictures.map { |picture| picture.image.url }

    video_path = VideoGeneratorService.generate_slideshow(images)

    event.update(video_url: video_path)

    # event.attendees.each do |user|
    #   NotificationService.notify(user, "El video del evento #{event.name} está listo.", event.id)
    # end
  end
end

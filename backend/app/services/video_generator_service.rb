class VideoGeneratorService
  require 'open-uri'
  require 'mini_magick'

  def self.generate_video_for_event(event_id)
    event = Event.find(event_id)
    image_urls = event.picture_urls
    image_paths = []

    # Descargar imágenes y guardarlas temporalmente
    image_urls.each_with_index do |url, index|
      file_path = Rails.root.join("tmp/videos", "image_#{index}.jpg")
      File.open(file_path, 'wb') do |file|
        file.write URI.open(url).read
      end

      image = MiniMagick::Image.open(file_path)
      image.resize "1920x1080" if image.width > 1920 || image.height > 1080
      image.write(file_path)

      image_paths << file_path
    end

    # Crear el video con FFmpeg
    output_video_path = Rails.root.join("tmp/videos", "event_video.mp4")
    ffmpeg_command = "ffmpeg -framerate 1/3 -i #{Rails.root.join("tmp/videos", "image_%d.jpg")} -c:v libx264 #{output_video_path}"
    system(ffmpeg_command)

    # Sube el video a Active Storage (o donde prefieras) y retorna la URL
    event.video.attach(io: File.open(output_video_path), filename: 'event_video.mp4', content_type: 'video/mp4')
    video_url = Rails.application.routes.url_helpers.rails_blob_url(event.video, host: 'localhost', port: 3001)

    # Limpiar los archivos temporales
    image_paths.each { |path| File.delete(path) }
    File.delete(output_video_path)

    video_url
  end
end

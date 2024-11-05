class API::V1::EventsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_event, only: [:show, :update, :destroy, :add_images]

  def index_by_bar
    @events = Event.where(bar_id: params[:bar_id])
    render json: @events
  end

  def show
    @event = Event.find(params[:id])

    # Serializar selectivamente los atributos que necesitas
    event_data = {
      id: @event.id,
      name: @event.name,
      description: @event.description,
      date: @event.date,
      end_date: @event.end_date,
      video_url: @event.video.attached? ? Rails.application.routes.url_helpers.rails_blob_url(@event.video, host: 'localhost', port: 3001) : nil

    }

    render json: event_data
  end

  def generate_video
    event_id = params[:id]

    if VideoGeneratorService.generate_video_for_event(event_id)
      render json: { message: 'Video generado con éxito' }, status: :ok
    else
      render json: { error: 'No se pudo generar el video' }, status: :unprocessable_entity
    end
  end


  def events_with_attendance
    bar = Bar.find_by(id: params[:id])
    user_id = params[:user_id]

    if bar
      # Obtener todos los eventos del bar
      events = bar.events

      # Agregar el estado de asistencia para cada evento
      events_with_attendance = events.map do |event|
        # Buscar si el usuario tiene una asistencia confirmada para este evento
        attendance = Attendance.find_by(user_id: user_id, event_id: event.id)
        event_attributes = event.attributes
        event_attributes[:checked_in] = attendance.present? && attendance.checked_in
        event_attributes
      end

      render json: events_with_attendance
    else
      render json: { error: "Bar no encontrado" }, status: :not_found
    end
  end

  def event_pictures
    @event = Event.find(params[:event_id])
    pictures = @event.event_pictures.map do |picture|
      if picture.image.attached?
        { id: picture.id, image_url: url_for(picture.image) }
      else
        { id: picture.id, image_url: nil }
      end
    end

    render json: { event_id: @event.id, pictures: pictures }, status: :ok
  end

  def display_picture

    @event = Event.find(params[:event_id])
    picture = @event.event_pictures.find_by(id: params[:picture_id])

    if picture&.image&.attached?
      render json: { id: picture.id, image_url: url_for(picture.image) }, status: :ok
    else
      render json: { error: 'Imagen no encontrada o no adjunta.' }, status: :not_found
    end
  end

  def tags
    @event = Event.find(params[:event_id])
    picture = @event.event_pictures.find(params[:picture_id])

    tags = picture.picture_tags.map do |tag|
      user = tag.user
      { user_id: user.id, handle: user.handle, first_name: user.first_name, last_name: user.last_name }
    end

    render json: { tags: tags }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Imagen o etiquetas no encontradas.' }, status: :not_found
  end

  def add_picture_tag
    @event = Event.find(params[:event_id])
    @event_picture = @event.event_pictures.find(params[:picture_id])
    user = User.find(params[:user_id])
    if @event_picture.picture_tags.create(user: user)
      render json: { success: 'Usuario etiquetado correctamente en la imagen' }, status: :ok
    else
      render json: { error: 'No se pudo etiquetar al usuario' }, status: :unprocessable_entity
    end
  end

  def remove_picture_tag
    @event = Event.find(params[:event_id])
    @event_picture = @event.event_pictures.find(params[:picture_id])
    tag = @event_picture.picture_tags.find_by(user_id: params[:user_id])
    if tag&.destroy
      render json: { success: 'Usuario des-etiquetado de la imagen' }, status: :ok
    else
      render json: { error: 'No se pudo des-etiquetar al usuario' }, status: :unprocessable_entity
    end
  end


  def create
    @event = Event.new(event_params)
    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    if @event.update(event_params)
      render json: @event
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @event.destroy
    head :no_content
  end

  def add_images
    if params[:event_picture].present? && params[:event_picture][:user_id].present? && params[:event_picture][:flyer_base64].present?
      user = User.find(params[:event_picture][:user_id])
      flyer_data = params[:event_picture][:flyer_base64]
      content_type = flyer_data.match(%r{data:(.*?);base64})[1]
      encoded_image = flyer_data.sub(%r{data:.*;base64,}, '')
      decoded_image = Base64.decode64(encoded_image)

      picture = @event.event_pictures.new(user: user)
      picture.image.attach(io: StringIO.new(decoded_image), filename: "flyer_#{Time.now.to_i}.#{content_type.split('/').last}", content_type: content_type)

      if picture.save
        render json: { id: picture.id, image_url: url_for(picture.image) }, status: :ok
      else
        render json: { error: 'Error al guardar la imagen' }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Parámetros incompletos' }, status: :unprocessable_entity
    end
  end






  private

  def set_event
    @event = Event.find(params[:id])
  end

  def event_params
    puts "Params: #{params.inspect}"
    params.require(:event).permit(:name, :description, :date, :flyer, :bar_id)
  end
end

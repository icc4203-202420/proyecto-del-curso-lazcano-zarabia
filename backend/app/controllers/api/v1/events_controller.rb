class API::V1::EventsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_event, only: [:show, :update, :destroy, :add_images]

  def index_by_bar
    @events = Event.where(bar_id: params[:bar_id])
    render json: @events
  end

  def show
    render json: @event
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
    if params[:flyers].present? && params[:user_id].present?
      user = User.find(params[:user_id])  # Buscar el usuario por el `user_id` recibido

      params[:flyers].each do |flyer|
        picture = @event.event_pictures.new(user: user)  # Asociar el `picture` con el evento y el usuario

        if picture.image.attach(flyer)
          puts "Imagen adjuntada correctamente: #{picture.image.attached?}"
          picture.save!
          puts "Picture guardado con ID: #{picture.id}"
        else
          puts "Error al adjuntar la imagen: #{flyer.original_filename}"
        end
      end

      # Devolver la lista de imágenes actualizada
      pictures = @event.event_pictures.map do |picture|
        { id: picture.id, image_url: picture.image.attached? ? url_for(picture.image) : nil }
      end
      render json: { event_id: @event.id, pictures: pictures }, status: :ok
    else
      render json: { error: 'No se proporcionaron imágenes o usuario para subir' }, status: :unprocessable_entity
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

class API::V1::ReviewsController < ApplicationController
  respond_to :json
  #before_action :set_user, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]

  def index
    beer = Beer.find(params[:beer_id]) # Encuentra la cerveza por su ID
    reviews = beer.reviews # Obtiene todas las reseñas asociadas a esa cerveza
    render json: reviews # Devuelve las reseñas en formato JSON
  end

  # def index
  #   @reviews = Review.where(user: @user)
  #   render json: { reviews: @reviews }, status: :ok
  # end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    beer = Beer.find(params[:beer_id])
    @review = beer.reviews.build(review_params)

    if @review.save
      render json: @review, status: :created
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  # def set_user
  #   @user = User.find(params[:user_id])
  # end

  def review_params
    params.require(:review).permit(:text, :rating, :beer_id, :user_id)
  end

end

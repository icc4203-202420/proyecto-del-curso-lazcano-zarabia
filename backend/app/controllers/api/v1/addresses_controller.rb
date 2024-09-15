class API::V1::AddressesController < ApplicationController
  before_action :set_address, only: [:show, :update, :destroy]

  def index
    @addresses = Address.all
    render json: @addresses
  end

  def show
    render json: @address
  end

  def create
    @address = Address.new(address_params)

    if @address.save
      render json: @address, status: :created
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  def update
    if @address.update(address_params)
      render json: @address
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @address.destroy
    head :no_content
  end

  private

  def set_address
    @address = Address.find(params[:id])
  end

  def address_params
    params.require(:address).permit(:line1, :line2, :city, :country_id, :user_id)
  end
end

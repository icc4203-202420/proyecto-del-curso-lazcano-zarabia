class API::V1::FriendshipsController < ApplicationController

  def create
    friendship = Friendship.new(friendship_params)

    if friendship.save
      render json: friendship, status: :created
    else
      render json: { error: friendship.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def friendship_params
    params.require(:friendship).permit(:user_id, :friend_id, :bar_id)
  end
end

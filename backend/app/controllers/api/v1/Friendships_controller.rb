class API::V1::FriendshipsController < ApplicationController

  def create
    friendship = Friendship.new(friendship_params)

    if friendship.save
      render json: friendship, status: :created
    else
      render json: { error: friendship.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def check_friendship
    user_id = params[:user_id]
    friend_id = params[:friend_id]

    # Verificar si existe una amistad en la base de datos
    is_friend = Friendship.exists?(user_id: user_id, friend_id: friend_id) ||
                Friendship.exists?(user_id: friend_id, friend_id: user_id)

    render json: { is_friend: is_friend }
  end

  private

  def friendship_params
    params.require(:friendship).permit(:user_id, :friend_id, :bar_id)
  end
end

class API::V1::AttendancesController < ApplicationController
  def index_by_event
    @attendances = Attendance.where(event_id: params[:event_id])
    render json: @attendances
  end

  def user_attendances
    attendances = Attendance.find_by(user_id: params[:user_id], event_id: params[:id])
    render json: { checked_in: attendances.checked_in}
  end

  def create
    @attendance = Attendance.new(attendance_params)

    if @attendance.save

      send_push_notifications_to_friends(@attendance.user_id, @attendance.event_id)
      render json: @attendance, status: :created
    else
      render json: { error: @attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def attendance_params
    params.require(:attendance).permit(:user_id, :event_id)
  end

  def send_push_notifications_to_friends(user_id, event_id)
    user = User.find(user_id)
    friends = user.friends

    puts "Sending push notifications to friends of #{user.first_name}"

    friends.each do |friend|
      #next unless friend.notification_token # Salta si el token es nulo
      puts "Sending push notification to #{friend.first_name} token: (#{friend.notification_token})"

      send_push_notification(friend.notification_token, event_id)
    end
  end

  def send_push_notification(token, event_id)
    event = Event.find(event_id)

    puts "Sending push notification to #{token} for event #{event.name}"

    fcm_client = FCM.new("YOUR_SERVER_KEY")
    options = {
      notification: {
        title: "¡Tu amigo hizo check-in!",
        body: "Tu amigo ha confirmado su asistencia a un evento.",
      },
      data: { event_name: event.name }
    }
    fcm_client.send([token], options)
  end



end

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
      render json: @attendance, status: :created
    else
      render json: { error: @attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def attendance_params
    params.require(:attendance).permit(:user_id, :event_id)
  end

end

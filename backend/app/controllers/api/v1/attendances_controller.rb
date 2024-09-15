class API::V1::AttendancesController < ApplicationController
  def index_by_event
    @attendances = Attendance.where(event_id: params[:event_id])
    render json: @attendances
  end
end

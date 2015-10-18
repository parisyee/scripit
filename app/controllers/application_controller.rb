class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate if Rails.env.production?

  private

  def authenticate
    authenticate_or_request_with_http_basic do |user, password|
      user == ENVied.BASIC_AUTH_USER &&
        password== ENVied.BASIC_AUTH_PASSWORD
    end
  end
end

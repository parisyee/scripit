class WelcomeController < ApplicationController
  def index
    render text: "<h1>Hello, world!</h1></p>Welcome to Script-it</p>".html_safe
  end
end

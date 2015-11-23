require "capybara/rails"

Capybara.configure do |config|
  config.javascript_driver = :webkit
  config.default_max_wait_time = 10
end

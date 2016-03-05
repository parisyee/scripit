require "capybara/rails"

Capybara.configure do |config|
  config.javascript_driver = :webkit
  config.default_max_wait_time = 10
end

RSpec.configure do |config|
  config.before(selenium: true) do
    Capybara.current_driver = :selenium
  end
end

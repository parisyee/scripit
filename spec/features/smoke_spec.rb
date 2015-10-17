require "rails_helper"

RSpec.describe "Smoke", type: :feature do
  scenario "the app loads" do
    visit "/"

    expect(page).to have_content "Hello, world!"
    expect(page).to have_content "Welcome to Script-it"
  end
end

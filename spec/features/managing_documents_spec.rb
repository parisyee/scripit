require "rails_helper"

RSpec.describe "User manages documents", type: :feature do
  scenario do
    visit "/"

    expect(page).to have_content "New Document"

    fill_in "Title", with: "Awesome Document"
    fill_in "Content", with: "INT. APARTMENT - DAY"
    click_button "Create"

    within "ul" do
      expect(page).to have_content "Awesome Document"
      expect(page).to have_content "INT. APARTMENT - DAY"
    end
  end
end

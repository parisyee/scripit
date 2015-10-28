require "rails_helper"

RSpec.describe "User manages documents", type: :feature do
  scenario do
    visit "/"

    expect(page).to have_content "New Document"

    fill_in "Title", with: "Awesome Document"
    fill_in "Content", with: "INT. APARTMENT - DAY"
    click_button "Save"

    within "li", text: "Awesome Document" do
      expect(page).to have_content "INT. APARTMENT - DAY"
    end

    click_link "Awesome Document"
    fill_in "Content", with: "EXT. PARKINK LOT - NIGHT"
    click_button "Save"

    within "li", text: "Awesome Document" do
      expect(page).to have_content "EXT. PARKINK LOT - NIGHT"
    end
  end
end

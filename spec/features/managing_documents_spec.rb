require "rails_helper"

RSpec.describe "User manages documents", :js, type: :feature do
  scenario "creating a document" do
    visit_workspace

    fill_in "document[title]", with: "The Old Apartment"
    fill_in "document[content]", with: "INT. APARTMENT - DAY"
    wait_for_autosave

    reload_page
    click_link "The Old Apartment"

    expect(page).to have_field "document[title]", with: "The Old Apartment"
    expect(page).to have_field "document[content]", with: "INT. APARTMENT - DAY"
  end

  def visit_workspace
    visit "/"
    wait_for_react_components
  end

  def reload_page
    visit page.current_path
    wait_for_react_components
  end

  def wait_for_react_components
    Timeout::timeout(20) do
      loop until react_components_loaded?
    end
  end

  def react_components_loaded?
    page.evaluate_script("typeof React === 'object'") &&
      page.find(".workspace")
  end
end

require "rails_helper"
require "support/experience"
require "support/capabilities/screenplays"

RSpec.describe "Managing sections", :js, type: :feature do
  scenario do
    ux = Experience.new.extend(Capabilities::Screenplays)
    screenplay = create(:screenplay, title: "Aristocats")
    create(:section, screenplay: screenplay)

    ux.visit_screenplays
    ux.click_link "Aristocats"
    ux.wait_for_screenplay_editor
    ux.edit_section_title("Introduction")
    ux.edit_section_notes("This is the first part of the movie")

    ux.has_waited_for_autosave?
    ux.reload_page
    ux.wait_for_screenplay_editor

    ux.within ".screenplay-editor" do
      expect(ux).to have_field "section[title]", with: "Introduction"
      expect(ux).to have_field "section[notes]", with: "This is the first part of the movie"
    end
  end
end


require "rails_helper"
require "support/experience"
require "support/capabilities/screenplays"
require "support/capabilities/sections"

RSpec.describe "Managing sections", :js, type: :feature do
  scenario do
    create(:screenplay, :with_section, title: "Aristocats")

    ux.visit_screenplays
    ux.click_link "Aristocats"
    ux.wait_for_screenplay_editor
    ux.edit_section_title("Introduction")
    ux.edit_section_notes("This is the first part of the movie")

    ux.has_waited_for_autosave?
    ux.reload_page

    ux.within ".section" do
      expect(ux).to have_field "section[title]", with: "Introduction"
      expect(ux).to have_field "section[notes]", with: "This is the first part of the movie"
    end

    ux.add_new_section
    ux.edit_section_title("Climax")
    ux.has_waited_for_autosave?

    ux.within_sidebar do
      expect(ux).to have_link "Introduction"
      expect(ux).to have_link "Climax"
    end

    ux.edit_section_notes("Shit goes down")
    ux.has_waited_for_autosave?
    ux.reload_page
    ux.navigate_to_section("Climax")

    ux.within ".section" do
      expect(ux).to have_field "section[title]", with: "Climax"
      expect(ux).to have_field "section[notes]", with: "Shit goes down"
    end
  end

  def ux
    @ux ||= Experience.new.tap do |x|
      x.extend(Capabilities::Screenplays)
      x.extend(Capabilities::Sections)
    end
  end
end


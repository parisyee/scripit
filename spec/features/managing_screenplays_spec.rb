require "rails_helper"
require "support/experience"
require "support/capabilities/screenplays"
require "support/capabilities/sections"

RSpec.describe "Managing screenplays", :js, type: :feature do
  scenario do
    behavior "writer creates a screenplay" do
      ux.visit_screenplays
      ux.add_screenplay
      ux.open_section_list_modal
      ux.edit_screenplay_title("Monsters Inc")
      ux.reload_page
      ux.open_section_list_modal

      expect(ux).to have_field "screenplay[title]", with: "Monsters Inc"

      ux.visit_screenplays

      expect(ux).to have_link "Monsters Inc"
    end

    behavior "writer edits a screenplay" do
      ux.navigate_to_screenplay("Monsters Inc")
      ux.open_section_list_modal
      ux.edit_screenplay_title("Terminator II")
      ux.visit_screenplays

      expect(ux).to have_link "Terminator II"
    end

    # behavior "writer deletes screenplay" do
    #   ux.delete_screenplay("Terminator II")

    #   expect(ux).not_to have_content("Terminator II")
    # end
  end

  def ux
    @ux ||= Experience.new.tap do |x|
      x.extend(Capabilities::Screenplays)
      x.extend(Capabilities::Sections)
    end
  end
end

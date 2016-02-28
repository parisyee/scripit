require "rails_helper"
require "support/experience"
require "support/capabilities/screenplays"

RSpec.describe "Managing screenplays", :js, type: :feature do
  scenario do
    ux = Experience.new.extend(Capabilities::Screenplays)

    behavior "writer creates a screenplay" do
      ux.visit_screenplays
      ux.add_screenplay("Monsters Inc")
      ux.reload_page

      expect(ux).to have_field "screenplay[title]", with: "Monsters Inc"

      ux.visit_screenplays

      expect(ux).to have_link "Monsters Inc"
    end

    behavior "writer edits a screenplay" do
      ux.navigate_to_screenplay("Monsters Inc")
      ux.edit_screenplay_title("Terminator II")
      ux.visit_screenplays

      expect(ux).to have_link "Terminator II"
    end

    behavior "writer deletes screenplay" do
      ux.delete_screenplay("Terminator II")

      expect(ux).not_to have_content("Terminator II")
    end
  end
end

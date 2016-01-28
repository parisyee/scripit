require "rails_helper"
require "support/experience"
require "support/capabilities/screenplays"

RSpec.describe "Creating a screenplay", :js, type: :feature do
  scenario do
    ux = Experience.new.extend(Capabilities::Screenplays)
    ux.visit_screenplays
    ux.add_screenplay("Terminator X")
    ux.has_waited_for_autosave?

    ux.reload_page

    ux.within ".screenplay-editor" do
      expect(ux).to have_field "screenplay[title]", with: "Terminator X"
    end
  end
end

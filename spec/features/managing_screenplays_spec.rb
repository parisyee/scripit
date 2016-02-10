require "rails_helper"
require "support/experience"
require "support/capabilities/screenplays"

RSpec.describe "Managing screenplays", :js, type: :feature do
  scenario do
    ux = Experience.new.extend(Capabilities::Screenplays)
    create(:screenplay, title: "Monsters Inc")

    ux.visit_screenplays
    expect(ux).to have_link "Monsters Inc"

    ux.add_screenplay("Terminator X")
    ux.has_waited_for_autosave?
    ux.reload_page

    ux.within ".screenplay-editor" do
      expect(ux).to have_field "screenplay[title]", with: "Terminator X"
    end

    ux.visit_screenplays
    expect(ux).to have_link "Terminator X"

    ux.delete_screenplay("Terminator X")
    expect(ux).not_to have_content("Terminator X")
  end
end

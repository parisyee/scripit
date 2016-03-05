require "rails_helper"
require "support/experience"
require "support/capabilities/screenplay_elements"
require "support/capabilities/screenplays"
require "support/capabilities/sections"

RSpec.describe "Managing screenplay elements", :selenium, type: :feature do
  scenario do
    create(:screenplay, title: "Aristocats")
    ux.visit_screenplays

    behavior "adding screenplay elements" do
      ux.click_link "Aristocats"
      ux.wait_for_screenplay_editor
      ux.add_new_section
      content = "INT. PHYSICAL THERAPY OFFICE - DAY\n" +
        "NADINE GITA lies on the table reading emails on her phone.\n" +
        "\tTHERAPIST\n" +
        "Are you relaxing?"
      ux.add_screenplay_content(content)
      ux.has_waited_for_autosave?
      ux.reload_page

      expect(ux).to have_screenplay_element_list([
        ["heading", "INT. PHYSICAL THERAPY OFFICE - DAY"],
        ["action", "NADINE GITA lies on the table reading emails on her phone."],
        ["character", "THERAPIST"],
        ["dialogue", "Are you relaxing?"]
      ])
    end
  end

  def ux
    @ux ||= Experience.new.tap do |x|
      x.extend(Capabilities::ScreenplayElements)
      x.extend(Capabilities::Screenplays)
      x.extend(Capabilities::Sections)
    end
  end
end

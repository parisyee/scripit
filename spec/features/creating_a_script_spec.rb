require "rails_helper"

RSpec.describe "Creating a script", :js, type: :feature do
  scenario do
    visit_scripts
    add_script("Terminator X")
    edit_scene_heading("int. spaceship - day/night")
    edit_section_title("Introduction")
    edit_section_notes("This is the first part of the movie")
    has_waited_for_autosave?

    reload_page

    within ".document-editor" do
      expect(page).to have_content "INT. SPACESHIP - DAY/NIGHT"
      expect(page).to have_field "document[title]", with: "Terminator X"
      expect(page).to have_field "section[title]", with: "Introduction"
      expect(page).to have_field "section[notes]", with: "This is the first part of the movie"
    end
  end

  def visit_scripts
    visit "/"
  end

  def add_script(title)
    click_link "New Script"
    wait_for_screenplay_editor
    fill_in "document[title]", with: title
  end

  def edit_scene_heading(content)
    # THERE MUST BE A BETTER WAY!
    execute_script(<<-JS)
      var el = $("#heading-0-hidden-input");
      el.val("#{content}");
      el.trigger("input");
    JS
  end

  def edit_section_title(title)
    fill_in "section[title]", with: title
  end

  def edit_section_notes(notes)
    fill_in "section[notes]", with: notes
  end

  def has_waited_for_autosave?
    indicator = find("#autosave-indicator")
    Timeout::timeout(3) do
      loop until indicator.text == "Changes Saved"
    end
  end

  def reload_page
    visit page.current_path
    wait_for_screenplay_editor
  end

  def wait_for_screenplay_editor
    Timeout::timeout(20) do
      loop until screenplay_editor_has_loaded?
    end
  end

  def screenplay_editor_has_loaded?
    page.evaluate_script("typeof React === 'object'") &&
      page.find(".document-editor")
  end
end

module Capabilities
  module Screenplays
    def visit_screenplays
      visit "/"
    end

    def navigate_to_screenplay(title)
      visit_screenplays
      click_link title
    end

    def add_screenplay
      click_button "Create screenplay"
      wait_for_screenplay_editor
    end

    def delete_screenplay(title)
      within ".screenplay-index-row", text: title do
        click_link "Delete screenplay"
      end
    end

    def has_waited_for_autosave?
      indicator = find("#autosave-indicator")
      Timeout::timeout(3) do
        loop until indicator[:class].include?("saved")
      end
    end

    def reload_page
      visit page.current_path
      wait_for_screenplay_editor
      sleep 1
      wait_for_ajax
    end

    def wait_for_screenplay_editor
      Timeout::timeout(20) do
        loop until screenplay_editor_has_loaded?
      end
    end

    def screenplay_editor_has_loaded?
      page.evaluate_script("typeof React === 'object'") &&
        page.find(".screenplay-editor")
    end
  end
end

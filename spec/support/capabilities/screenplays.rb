module Capabilities
  module Screenplays
    def visit_screenplays
      visit "/"
    end

    def add_screenplay(title)
      click_button "New Screenplay"
      wait_for_screenplay_editor
      fill_in "screenplay[title]", with: title
    end

    def delete_screenplay(title)
      within "td", text: title do
        click_link "X"
      end
    end

    def edit_scene_heading(content)
      # THERE MUST BE A BETTER WAY!
      execute_script(<<-JS)
      var el = $("#heading-0-hidden-input");
      el.val("#{content}");
      el.trigger("input");
      JS
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
        page.find(".screenplay-editor")
    end
  end
end

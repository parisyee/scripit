module Capabilities
  module Sections
    def add_new_section
      open_section_list_modal
      find("a.create-section").click
      wait_for_ajax
    end

    def open_section_list_modal
      find("a#section-list-modal-toggle").click
    end

    def navigate_to_section(title)
      open_section_list_modal
      within_section_list_modal do
        find(".section-list-item", text: title).click
        wait_for_ajax
      end
    end

    def change_section_position(position)
      within_section do
        select position, from: "section[position]"
      end
    end

    def edit_screenplay_title(title)
      fill_in "screenplay[title]", with: title
      has_waited_for_autosave?
    end

    def edit_section_title(title)
      within_section do
        fill_in "section[title]", with: title
      end
    end

    def edit_section_notes(notes)
      within_section do
        fill_in "section[notes]", with: notes
      end
    end

    def delete_section
      click_link "Delete section"
      page.driver.browser.accept_js_confirms
      wait_for_ajax
    end

    def within_section
      within ".section-editor" do
        yield
      end
    end

    def within_section_list_modal
      within "#section-list-modal" do
        yield
      end
    end
  end
end

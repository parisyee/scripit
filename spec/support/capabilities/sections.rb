module Capabilities
  module Sections
    def add_new_section
      click_link "Create new section"
      wait_for_ajax
    end

    def navigate_to_section(title)
      within_sidebar do
        find(".section-list-item", text: title).click
        wait_for_ajax
      end
    end

    def change_section_position(position)
      within_section do
        select position, from: "section[position]"
      end
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
      wait_for_ajax
    end

    def within_section
      within ".section-editor" do
        yield
      end
    end

    def within_sidebar
      within ".sidebar" do
        yield
      end
    end
  end
end

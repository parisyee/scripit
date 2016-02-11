module Capabilities
  module Sections
    def add_new_section
      click_link "New Section"
      wait_for_ajax
    end

    def navigate_to_section(title)
      within_sidebar do
        click_link(title)
        wait_for_ajax
      end
    end

    def edit_section_title(title)
      fill_in "section[title]", with: title
    end

    def edit_section_notes(notes)
      fill_in "section[notes]", with: notes
    end

    def delete_section
      click_link "Delete Section"
      wait_for_ajax
    end

    def within_section
      within ".section" do
        yield
      end
    end

    def within_sidebar
      within ".section-list" do
        yield
      end
    end
  end
end

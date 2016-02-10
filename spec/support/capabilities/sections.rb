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

    def within_sidebar
      within ".section-list" do
        yield
      end
    end
  end
end

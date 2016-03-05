module Capabilities
  module ScreenplayElements
    def add_screenplay_content(content)
      within ".screenplay-element-list" do
        find(".element-input").send_keys(content.split(""))
      end
    end
  end
end

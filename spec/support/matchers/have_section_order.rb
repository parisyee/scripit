module Support
  module Matchers
    def have_section_order(section_titles)
      HaveSectionOrder.new(section_titles)
    end

    class HaveSectionOrder
      def initialize(section_titles)
        @expected_order = section_titles
      end

      def matches?(page)
        @page = page
        @expected_order == actual_section_order
      end

      def description
        "has section order #{@expected_order}"
      end

      def failure_message
        "expected page to have section order #{@expected_order} but instead " +
        "it was #{actual_section_order}"
      end

      private

      def actual_section_order
        @actual_section_order ||=
          begin
            @page.find(".section-list").find_all(".section-list-item-title").map(&:text)
          end
      end
    end
  end
end

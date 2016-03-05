module Support
  module Matchers
    def have_screenplay_element_list(element_list)
      HaveScreenplayElementList.new(element_list)
    end

    class HaveScreenplayElementList
      def initialize(element_list)
        @expected_element_list = element_list
      end

      def matches?(page)
        @page = page
        expected_element_list == actual_element_list
      end

      def description
        "has element list #{expected_element_list}"
      end

      def failure_message
        "expected page to have element list #{expected_element_list} " +
          "but instead it was #{actual_element_list}"
      end

      private

      attr_reader :expected_element_list, :page

      def actual_element_list
        @actual_element_list ||=
          begin
            [].tap do |results|
              page.all(".screenplay-element").each do |element|
                type = element[:id].split("-").first
                text = element.text
                results << [type, text]
              end
            end
          end
      end
    end
  end
end

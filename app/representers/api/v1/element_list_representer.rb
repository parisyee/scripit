module Api
  module V1
    module ElementListRepresenter
      include Roar::JSON

      property :elements

      def elements
        if content.present? && content != ""
          content
        else
          "[]"
        end
      end

    end
  end
end

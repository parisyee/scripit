module Api
  module V1
    module SectionRepresenter
      include Roar::JSON
      include Rails.application.routes.url_helpers

      property :element_list_url
      property :id
      property :notes
      property :position
      property :title
      property :url

      private

      def element_list_url
        api_v1_section_element_list_path(id)
      end

      def url
        api_v1_section_path(id)
      end
    end
  end
end

module Api
  module V1
    class ElementListsController < ApplicationController
      respond_to :json

      def show
        respond_with section.extend(Api::V1::ElementListRepresenter)
      end

      def update
        section.update!(content: element_list_params[:elements])

        respond_with section
      end

      private

      def element_list_params
        params.require(:element_list).permit(:elements)
      end

      def section
        @section ||= Section.find(params[:section_id])
      end
    end
  end
end

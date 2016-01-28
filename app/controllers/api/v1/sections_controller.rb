module Api
  module V1
    class SectionsController < ApplicationController
      respond_to :json

      def update
        section = Section.find(params[:id])
        section.update!(section_params)

        respond_with section, location: nil
      end

      private

      def section_params
        params.require(:section).permit(:title, :notes)
      end
    end
  end
end

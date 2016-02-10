module Api
  module V1
    class SectionsController < ApplicationController
      respond_to :json

      def show
        section = screenplay.sections.find(params[:id]).extend(SectionRepresenter)

        respond_with section, location: nil
      end

      def create
        section = screenplay.sections.create!.extend(SectionRepresenter)

        respond_with section, location: nil
      end

      def update
        section = screenplay.sections.find(params[:id])
        section.update!(section_params)

        respond_with section, location: nil
      end

      private

      def section_params
        params.require(:section).permit(:title, :notes)
      end

      def screenplay
        @screenplay ||= Screenplay.find(params[:screenplay_id])
      end
    end
  end
end

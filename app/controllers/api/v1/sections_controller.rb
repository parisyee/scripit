module Api
  module V1
    class SectionsController < ApplicationController
      respond_to :json

      def show
        section = find_section.extend(Api::V1::SectionRepresenter)

        respond_with section
      end

      def create
        section = screenplay.sections.create!.extend(Api::V1::SectionRepresenter)

        respond_with section, location: nil
      end

      def update
        section = find_section
        section.update!(section_params)

        respond_with section
      end

      def destroy
        section = find_section.destroy!

        respond_with section
      end

      private

      def section_params
        params.require(:section).permit(:notes, :position, :title, :content)
      end

      def find_section
        Section.find(params[:id])
      end

      def screenplay
        @screenplay ||= Screenplay.find(params[:screenplay_id])
      end
    end
  end
end

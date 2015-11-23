module Api
  module V1
    class DocumentsController < ApplicationController
      # def index
      #   documents = Document.all.order(updated_at: :desc)

      #   render documets JSON.generate
      # end

      def create
        document = Document.create!(document_params)

        render json: document.to_json
      end

      def update
        document = Document.find(params[:id])
        document.update!(document_params)

        render json: document.to_json
      end

      private

      def document_params
        params.require(:document).permit(:title, :content)
      end
    end
  end
end

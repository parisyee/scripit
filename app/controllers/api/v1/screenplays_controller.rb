module Api
  module V1
    class ScreenplaysController < ApplicationController
      def create
        screenplay = Screenplay.create!(screenplay_params)

        render json: screenplay.to_json
      end

      def update
        screenplay = Screenplay.find(params[:id])
        screenplay.update!(screenplay_params)

        render json: screenplay.to_json
      end

      private

      def screenplay_params
        params.require(:screenplay).permit(:title, :content)
      end
    end
  end
end

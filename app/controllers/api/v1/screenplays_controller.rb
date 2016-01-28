module Api
  module V1
    class ScreenplaysController < ApplicationController
      respond_to :json

      def update
        screenplay = Screenplay.find(params[:id])
        screenplay.update!(screenplay_params)

        respond_with screenplay, location: nil
      end

      private

      def screenplay_params
        params.require(:screenplay).permit(:title)
      end
    end
  end
end

class ScreenplaysController < ApplicationController
  def index
    screenplays = Screenplay.all.order(updated_at: :desc)
    render locals: { screenplays: screenplays }
  end

  def new
    screenplay = Screenplay.create!(content: '[{"elements": [{"type": "heading", "text": ""}]}]')
    redirect_to screenplay_path(screenplay)
  end

  def show
    screenplay = Screenplay.find(params[:id])
    render locals: { screenplay: screenplay }
  end

  def destroy
    screenplay = Screenplay.find(params[:id])
    screenplay.destroy!

    redirect_to screenplays_path
  end
end

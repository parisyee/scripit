class ScreenplaysController < ApplicationController
  def index
    screenplays = Screenplay.all.order(updated_at: :desc)
    render locals: { screenplays: screenplays }
  end

  def create
    screenplay = Screenplay.create!
    screenplay.sections.create!
    redirect_to screenplay_workspace_path(screenplay)
  end

  def destroy
    screenplay = Screenplay.find(params[:id])
    screenplay.destroy!

    redirect_to screenplays_path
  end
end

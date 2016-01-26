class WorkspacesController < ApplicationController
  def show
    screenplay = Screenplay.
      find(params[:id]).
      extend(ScreenplayRepresenter).
      to_json

    render locals: { screenplay: screenplay }
  end
end

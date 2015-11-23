class WorkspaceController < ApplicationController
  def show
    documents = Document.all.order(updated_at: :desc)
    render locals: { documents: documents }
  end
end

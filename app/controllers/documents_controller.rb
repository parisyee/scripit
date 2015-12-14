class DocumentsController < ApplicationController
  def index
    documents = Document.all.order(updated_at: :desc)
    render locals: { documents: documents }
  end

  def show
    document = Document.find(params[:id])
    render locals: { document: document }
  end
end

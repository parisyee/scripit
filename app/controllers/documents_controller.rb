class DocumentsController < ApplicationController
  def index
    documents = Document.all.order(updated_at: :desc)
    render locals: { documents: documents }
  end

  def new
    document = Document.create!(content: '[{"elements": [{"type": "heading", "text": ""}]}]')
    redirect_to document_path(document)
  end

  def show
    document = Document.find(params[:id])
    render locals: { document: document }
  end

  def destroy
    document = Document.find(params[:id])
    document.destroy!

    redirect_to documents_path
  end
end

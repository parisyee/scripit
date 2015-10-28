class DocumentsController < ApplicationController
  def index
    documents = Document.all
    document = Document.new

    render locals: { documents: documents, document: document }
  end

  def create
    document = Document.create!(document_params)

    redirect_to documents_path(document)
  end

  def show
    document = Document.find(params[:id])
    documents = Document.all

    render :index, locals: { documents: documents, document: document }
  end

  def update
    document = Document.find(params[:id])
    document.update!(document_params)

    redirect_to document_path(document)
  end

  private

  def document_params
    params.require(:document).permit(:title, :content)
  end
end

class DocumentsController < ApplicationController
  def index
    documents = Document.all
    new_document = Document.new

    render locals: { documents: documents, new_document: new_document }
  end

  def create
    Document.create!(document_params)

    redirect_to documents_path
  end

  private

  def document_params
    params.require(:document).permit(:title, :content)
  end
end

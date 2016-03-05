module SectionRepresenter
  include Roar::JSON
  include Rails.application.routes.url_helpers

  property :id
  property :title
  property :url

  def url
    api_v1_section_path(id)
  end
end

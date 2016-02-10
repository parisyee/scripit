module ScreenplayRepresenter
  include Roar::JSON
  include Rails.application.routes.url_helpers

  property :id
  property :title
  property :url
  property :sections_url

  collection :sections, extend: SectionRepresenter, class: Section

  def url
    api_v1_screenplay_path(id)
  end

  def sections_url
    api_v1_screenplay_sections_path(id)
  end
end

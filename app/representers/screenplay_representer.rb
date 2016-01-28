module ScreenplayRepresenter
  include Roar::JSON
  include Rails.application.routes.url_helpers

  property :id
  property :title
  property :url

  collection :sections, extend: SectionRepresenter, class: Section

  def url
    api_v1_screenplay_path(id)
  end
end

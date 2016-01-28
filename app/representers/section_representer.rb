module SectionRepresenter
  include Roar::JSON
  include Rails.application.routes.url_helpers

  property :id
  property :notes
  property :position
  property :title
  property :url

  collection :elements, extend: ElementRepresenter, class: Element

  def url
    api_v1_screenplay_section_path(screenplay.id, id)
  end
end

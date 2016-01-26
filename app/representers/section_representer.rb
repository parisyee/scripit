module SectionRepresenter
  include Roar::JSON

  property :id
  property :notes
  property :position
  property :title

  collection :elements, extend: ElementRepresenter, class: Element
end

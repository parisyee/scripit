module ScreenplayRepresenter
  include Roar::JSON

  property :id
  property :title

  collection :sections, extend: SectionRepresenter, class: Section
end

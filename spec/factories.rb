FactoryGirl.define do
  factory :screenplay do
  end

  factory :section do
    screenplay
  end

  factory :element do
    section
  end

  factory :heading_element, parent: :element do
    type "Elements::Heading"
  end
end

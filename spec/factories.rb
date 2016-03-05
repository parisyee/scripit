FactoryGirl.define do
  factory :screenplay do
    trait :with_section do
      after(:create) do |screenplay|
        create(:section, screenplay: screenplay)
      end
    end
  end

  factory :section do
    screenplay
  end

  # factory :element do
  #   section
  # end

  # factory :heading_element, parent: :element do
  #   type "Elements::Heading"
  # end
end

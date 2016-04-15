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
end

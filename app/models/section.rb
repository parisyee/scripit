class Section < ActiveRecord::Base
  belongs_to :screenplay
  has_many :elements, dependent: :destroy

  acts_as_list scope: :screenplay, top_of_list: 0
end

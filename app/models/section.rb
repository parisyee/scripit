class Section < ActiveRecord::Base
  belongs_to :screenplay
  has_many :elements, dependent: :destroy

  acts_as_list scope: :screenplay

  default_scope { order(position: :asc) }
end

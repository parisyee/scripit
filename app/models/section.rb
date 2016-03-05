class Section < ActiveRecord::Base
  belongs_to :screenplay

  acts_as_list scope: :screenplay

  default_scope { order(position: :asc) }
end

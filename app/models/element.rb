class Element < ActiveRecord::Base
  belongs_to :section

  acts_as_list scope: :section, top_of_list: 0
end

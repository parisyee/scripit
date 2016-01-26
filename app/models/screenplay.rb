class Screenplay < ActiveRecord::Base
  has_many :sections, dependent: :destroy
end

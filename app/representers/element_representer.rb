module ElementRepresenter
  include Roar::JSON

  property :id
  property :position
  property :text
  property :type

  def type
    super.gsub("Elements::", "").downcase
  end
end

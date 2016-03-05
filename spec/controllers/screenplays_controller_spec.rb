require "rails_helper"

RSpec.describe ScreenplaysController, type: :controller do
  describe ".destroy" do
    it "destroys the screenplay along with all of it's sections and elements" do
      screenplay = create(:screenplay)
      create(:section, screenplay: screenplay)

      expect {
        delete :destroy, id: screenplay.id
      }.to change{ Screenplay.count }.by(-1).
      and change { Section.count }.by(-1)
    end
  end
end

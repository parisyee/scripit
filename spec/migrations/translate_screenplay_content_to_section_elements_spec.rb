require "rails_helper"

migration_file_1 = Dir[
  Rails.root.join(
    'db/migrate/*_translate_screenplay_content_to_section_elements.rb'
  )
].first
migration_file_2 = Dir[
  Rails.root.join(
    'db/migrate/*_remove_content_from_screenplays.rb'
  )
].first
require migration_file_1
require migration_file_2

RSpec.describe TranslateScreenplayContentToSectionElements do
  before do
    RemoveContentFromScreenplays.new.down
    TranslateScreenplayContentToSectionElements.new.down
  end

  after do
    RemoveContentFromScreenplays.new.up
    Screenplay.reset_column_information
  end

  describe ".up" do
    it "creates sections and elements from json data in screenplay content" do
      content_json = [
        {
          elements: [
            { type: "heading", text: "heading" },
            { type: "action", text: "action" },
            { type: "character", text: "character" }
          ],
          title: "Section 1",
          notes: "Notes 1"
        },
        {
          elements: [
            { type: "dialogue", text: "dialogue" },
            { type: "parenthetical", text: "parenthetical" },
            { type: "transition", text: "transition" }
          ],
          title: "Section 2",
          notes: "Notes 2"
        }
      ].to_json

      Screenplay.reset_column_information
      Screenplay.create!(title: "Screenplay 1", content: content_json)

      expect(Section.count).to eq(0)
      expect(Element.count).to eq(0)

      TranslateScreenplayContentToSectionElements.new.up

      expect(Section.count).to eq(2)
      expect(Element.count).to eq(6)

      screenplay = Screenplay.find_by_title("Screenplay 1")
      section1 = screenplay.sections.first
      section2 = screenplay.sections.second

      expect(section1.position).to eq 0
      expect(section1.title).to eq "Section 1"
      expect(section1.notes).to eq "Notes 1"
      expect(section1.elements.first.type).to eq "Elements::Heading"
      expect(section1.elements.second.type).to eq "Elements::Action"
      expect(section1.elements.last.text).to eq "character"


      expect(section2.position).to eq 1
      expect(section2.title).to eq "Section 2"
      expect(section2.notes).to eq "Notes 2"
      expect(section2.elements.first.text).to eq "dialogue"
      expect(section2.elements.second.text).to eq "parenthetical"
      expect(section2.elements.last.type).to eq "Elements::Transition"
    end
  end
end

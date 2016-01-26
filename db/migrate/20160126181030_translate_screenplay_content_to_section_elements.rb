class TranslateScreenplayContentToSectionElements < ActiveRecord::Migration
  def up
    Screenplay.all.each do |screenplay|
      content_sections = JSON.parse(screenplay.content)
      content_sections.each do |content_section|
        section = screenplay.sections.create!(
          title: content_section["title"],
          notes: content_section["notes"]
        )

        content_section["elements"].each do |content_element|
          section.elements.create!(
            type: "Elements::#{content_element["type"].capitalize}",
            text: content_element["text"]
          )
        end
      end
    end
  end

  def down
    Element.destroy_all
    Section.destroy_all
  end
end

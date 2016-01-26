class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.belongs_to :screenplay, null: false
      t.text :title
      t.text :notes
      t.integer :position, null: false
    end
  end
end

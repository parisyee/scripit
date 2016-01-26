class CreateElements < ActiveRecord::Migration
  def change
    create_table :elements do |t|
      t.belongs_to :section, null: false
      t.text :type
      t.text :text
      t.integer :position, null: false
    end
  end
end

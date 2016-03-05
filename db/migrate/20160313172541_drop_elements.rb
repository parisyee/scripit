class DropElements < ActiveRecord::Migration
  def up
    drop_table :elements
  end

  def down
    create_table :elements do |t|
      t.belongs_to :section, null: false
      t.text :type
      t.text :text
      t.integer :position, null: false
    end
  end
end

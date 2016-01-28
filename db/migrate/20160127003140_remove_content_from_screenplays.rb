class RemoveContentFromScreenplays < ActiveRecord::Migration
  def up
    remove_column :screenplays, :content
  end

  def down
    add_column :screenplays, :content, :text
  end
end

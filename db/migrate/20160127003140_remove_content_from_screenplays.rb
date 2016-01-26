class RemoveContentFromScreenplays < ActiveRecord::Migration
  def change
    remove_column :screenplays, :content
  end
end

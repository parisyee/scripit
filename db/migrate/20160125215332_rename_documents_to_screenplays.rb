class RenameDocumentsToScreenplays < ActiveRecord::Migration
  def change
    rename_table :documents, :screenplays
  end
end

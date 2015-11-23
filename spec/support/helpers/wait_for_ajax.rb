module WaitForAutosave
  AUTOSAVE_WAIT_TIME = 5

  def wait_for_autosave
    Timeout.timeout(AUTOSAVE_WAIT_TIME) do
      loop until finished_autosaving?
    end
  end

  def finished_autosaving?
    page.has_no_css?("#autosave-indicator", text: "Saving Changes...") &&
      page.has_css?("#autosave-indicator", text: "Changes Saved")
  end
end

RSpec.configure do |config|
  config.include WaitForAutosave, type: :feature
end

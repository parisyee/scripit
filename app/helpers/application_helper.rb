module ApplicationHelper
  def env_favicon
    if Rails.env.production?
      "quill.png"
    else
      "quill-dev.png"
    end
  end
end

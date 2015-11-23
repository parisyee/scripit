Rails.application.routes.draw do
  root "workspace#show"

  namespace :api do
    namespace :v1 do
      resources :documents, only: [:create, :update]
    end
  end
  resource :workspace, only: [:show]
end

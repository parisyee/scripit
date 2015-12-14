Rails.application.routes.draw do
  root "documents#index"

  namespace :api do
    namespace :v1 do
      resources :documents, only: [:create, :update]
    end
  end
  resources :documents, only: [:index, :show]
end

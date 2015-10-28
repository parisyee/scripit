Rails.application.routes.draw do
  root "documents#index"

  resources :documents, only: [:index, :create, :show, :update]
end

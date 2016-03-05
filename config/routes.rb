Rails.application.routes.draw do
  root "screenplays#index"

  namespace :api do
    namespace :v1 do
      resources :screenplays, only: [:update] do
        resources :sections, only: [:create]
      end
      resources :sections, only: [:show, :update, :destroy] do
        resource :element_list, only: [:show, :update]
      end
    end
  end
  resources :screenplays, only: [:index, :create, :destroy] do
    member do
      resource :workspace, only: [:show], as: :screenplay_workspace
    end
  end
end

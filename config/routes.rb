Rails.application.routes.draw do
  root "screenplays#index"

  namespace :api do
    namespace :v1 do
      resources :screenplays, only: [:update] do
        resources :sections, only: [:create, :update, :destroy] do
          resources :elements, only: [:create, :update, :destroy]
        end
      end
    end
  end
  resources :screenplays, only: [:index, :create, :destroy] do
    member do
      resource :workspace, only: [:show], as: "screenplay_workspace"
    end
  end
end

Rails.application.routes.draw do
  root "screenplays#index"

  namespace :api do
    namespace :v1 do
      resources :screenplays, only: [:create, :update] do
        member do
          resources :sections, only: [:create, :update, :destroy] do
            member do
              resources :elements, only: [:create, :update, :destroy]
            end
          end
        end
      end
    end
  end
  resources :screenplays, only: [:index, :destroy] do
    member do
      resource :workspace, only: [:show], as: "screenplay_workspace"
    end
  end
end

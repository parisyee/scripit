Rails.application.routes.draw do
  root "screenplays#index"

  namespace :api do
    namespace :v1 do
      resources :screenplays, only: [:create, :update]
    end
  end
  resources :screenplays, only: [:index, :new, :show, :destroy]
end

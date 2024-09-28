Rails.application.routes.draw do
  # devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  get 'current_user', to: 'current_user#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      resources :friendships, only: [:create]
      resources :bars do
        resources :events, only: [:index, :show], controller: 'events', action: :index_by_bar
      end
      resources :beers do
        resources :reviews, only: [:index, :create]
      end
      resources :users do
        resources :reviews, only: [:index,:show, :create]
      end
      resources :events, only: [:show, :create, :update, :destroy] do
        resources :attendances, only: [:create]
        get 'attendances', to: 'attendances#index_by_event'  # Añadir :create para soportar la creación
      end

      resources :addresses
    end
  end

end

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
      resources :friendships, only: [:create] do
        collection do
          post :check_friendship
          post :add_event
        end
      end
      resources :bars do
        resources :events, only: [:index, :show], controller: 'events', action: :index_by_bar
      end
      resources :beers do
        resources :reviews, only: [:index, :create]
      end
      resources :users do
        resources :reviews, only: [:index,:show, :create]
        resources :friendships, only: [:index, :show]
      end
      resources :events do
        resources :attendances, only: [:create]
        get 'attendances', to: 'attendances#index_by_event'
        get :event_pictures
        member do
          post :add_images
        end
        get 'event_pictures/:picture_id', to: 'events#display_picture', as: 'display_picture'

        get 'event_pictures/:picture_id/tags', to: 'events#tags', as: 'get_picture_tags'
        post 'event_pictures/:picture_id/tags', to: 'events#add_picture_tag', as: 'add_picture_tag'
        delete 'event_pictures/:picture_id/tags/:user_id', to: 'events#remove_picture_tag', as: 'remove_picture_tag'

      end

      resources :addresses
    end
  end

end

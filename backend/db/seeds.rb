require 'factory_bot_rails'

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Initialize the review counter
ReviewCounter.create(count: 10)

if Rails.env.development?

  # Crear países
  countries = FactoryBot.create_list(:country, 5)

  # Crear cervecerías (breweries) con marcas (brands) y cervezas (beers)
  countries.map do |country|
    FactoryBot.create(:brewery_with_brands_with_beers, countries: [country])
  end

  # Crear usuarios con direcciones asociadas
  users = FactoryBot.create_list(:user, 10) do |user, i|
    user.address.update(country: countries.sample)
  end

  # Crear bares con direcciones y cervezas asociadas
  bars = FactoryBot.create_list(:bar, 5) do |bar|
    bar.address.update(country: countries.sample)
    bar.beers << Beer.all.sample(rand(1..3))
  end

  # Crear eventos asociados a los bares
  events = bars.map do |bar|
    FactoryBot.create(:event, bar: bar)
  end

  # Crear relaciones de amistad entre usuarios
  users.combination(2).to_a.sample(5).each do |user_pair|
    FactoryBot.create(:friendship, user: user_pair[0], friend: user_pair[1], bar: bars.sample)
  end

  Review.create!([
    { text: "Cerveza equilibrada, refrescante y suave. Perfecta para cualquier ocasión.", rating: 4.5, user_id: 1, beer_id: 1 },
    { text: "Me encanta su aroma frutal. Ideal para disfrutar en un día caluroso.", rating: 4.0, user_id: 2, beer_id: 1 },
    { text: "El sabor es bueno, pero un poco más amargo de lo que prefiero.", rating: 3.5, user_id: 3, beer_id: 1 },
    { text: "Una excelente cerveza, el lúpulo y la malta están perfectamente balanceados.", rating: 5.0, user_id: 4, beer_id: 1 },
    { text: "Buena cerveza, aunque me hubiera gustado un poco más de cuerpo.", rating: 3.8, user_id: 5, beer_id: 1 },
    { text: "Decente, pero prefiero cervezas con más notas cítricas.", rating: 3.2, user_id: 6, beer_id: 1 },
    { text: "Sabor excelente, la mezcla de malta y lúpulo es perfecta.", rating: 4.8, user_id: 7, beer_id: 1 },
    { text: "Buena cerveza, aunque el final es un poco amargo para mi gusto.", rating: 4.2, user_id: 8, beer_id: 1 },
    { text: "El sabor es demasiado fuerte para mí, prefiero algo más ligero.", rating: 2.5, user_id: 9, beer_id: 1 },
    { text: "Cerveza refrescante, con un toque suave, ideal para cualquier ocasión.", rating: 4.7, user_id: 10, beer_id: 1 }
  ])

  Event.create([{
    name: "Fiesta Cervecera",
    description: "Una fiesta dedicada a los amantes de la cerveza.",
    date: DateTime.now + 1.day,
    bar_id: 1,
    start_date: DateTime.now + 1.day + 2.hours,
    end_date: DateTime.now + 1.day + 5.hours
  },{
    name: "Karaoke Night",
    description: "Una noche de diversión y música en vivo.",
    date: DateTime.now + 2.days,
    bar_id: 1,
    start_date: DateTime.now + 2.days + 3.hours,
    end_date: DateTime.now + 2.days + 6.hours
  },{
    name: "Trivia Night",
    description: "Compite en nuestro evento de trivia y gana premios.",
    date: DateTime.now + 3.days,
    bar_id: 1,
    start_date: DateTime.now + 3.days + 2.hours,
    end_date: DateTime.now + 3.days + 4.hours
  },{
    name: "Cata de Cervezas",
    description: "Prueba cervezas artesanales exclusivas.",
    date: DateTime.now + 4.days,
    bar_id: 1,
    start_date: DateTime.now + 4.days + 1.hour,
    end_date: DateTime.now + 4.days + 3.hours
  },{
    name: "Noche de Jazz",
    description: "Disfruta de música en vivo con nuestras mejores cervezas.",
    date: DateTime.now + 5.days,
    bar_id: 1,
    start_date: DateTime.now + 5.days + 2.hours,
    end_date: DateTime.now + 5.days + 5.hours
  },{
    name: "Oktoberfest",
    description: "Celebra con las mejores cervezas alemanas.",
    date: DateTime.now + 6.days,
    bar_id: 1,
    start_date: DateTime.now + 6.days + 1.hour,
    end_date: DateTime.now + 6.days + 4.hours
  },{
    name: "Feria de la Cerveza Artesanal",
    description: "Encuentra y prueba las mejores cervezas artesanales.",
    date: DateTime.now + 7.days,
    bar_id: 1,
    start_date: DateTime.now + 7.days + 1.hour,
    end_date: DateTime.now + 7.days + 4.hours
  },{
    name: "Noche de Rock",
    description: "Vive el rock en vivo acompañado de nuestras mejores cervezas.",
    date: DateTime.now + 8.days,
    bar_id: 1,
    start_date: DateTime.now + 8.days + 3.hours,
    end_date: DateTime.now + 8.days + 6.hours
  },{
    name: "Cerveza y Comida",
    description: "Disfruta de una cata de cervezas con maridaje.",
    date: DateTime.now + 9.days,
    bar_id: 1,
    start_date: DateTime.now + 9.days + 2.hours,
    end_date: DateTime.now + 9.days + 4.hours
  },{
    name: "Festival de la IPA",
    description: "Ven a disfrutar de las mejores IPAs de la región.",
    date: DateTime.now + 10.days,
    bar_id: 1,
    start_date: DateTime.now + 10.days + 2.hours,
    end_date: DateTime.now + 10.days + 5.hours
  }
  ]
  )
  Attendance.create([
    {
      user_id: 1,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 2,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 3,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 4,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 5,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 6,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 7,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 8,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 9,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    },
    {
      user_id: 10,
      event_id: 1,
      checked_in: true,
      created_at: DateTime.now,
      updated_at: DateTime.now
    }
  ])

  Country.create(id:34,name:"Chile")
  Address.create(id:21,line1:"Av Vitacura 9257", city:"Santiago", country_id:34,user_id:1)
  Bar.create(name:"Barba Azul", latitude: -33.3824107315216,longitude:-70.54742021868668, address_id:21)


end

module.exports = {
  userEagerOptions: '[brands.[events_attending.events], user_follows.[upvotes, food_genres, trucks.[locations(latest)]], events, events_attending.[events.[locations, owners, users_attending.users, brands_attending.brands]], user_rewards.[user_coupons.coupons, brands], orders.menuitems.brands]',
};

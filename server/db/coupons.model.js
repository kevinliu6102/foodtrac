const { Model } = require('objection');

class Coupons extends Model {
  static get tableName() {
    return 'Coupons';
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        percent_discount: { type: ['integer', 'null'] },
        flat_discount: { type: ['integer', 'null'] },
      },
    };
  }

  static get relationMappings() {
    return {
      brands: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/brands.model`,
        join: {
          from: 'Coupons.id',
          to: 'Brands.default_coupon_id',
        },
      },
      user_coupons: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/usercoupons.model`,
        join: {
          from: 'UserCoupons.user_rewards_id',
          to: 'Coupons.id',
        },
      },
    };
  }
}

module.exports = Coupons;

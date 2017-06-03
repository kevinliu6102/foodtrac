const Users = require('../../db/users.model');

module.exports = {
  get(req, res) {
    Users.query()
      .findById(req.params.userId)
      .eager('[brands, user_follows]')
      .then((user) => {
        user.is_truck_owner = Boolean(user.is_truck_owner); // eslint-disable-line no-param-reassign
        res.status(200).json(user);
      })
      .catch(e => res.status(400).send(e.message));
  },
  put(req, res) {
    Users.query()
      .findById(req.params.userId)
      .patch(req.body)
      .then(() => Users.query().findById(req.params.userId))
      .then((user) => {
        user.is_truck_owner = Boolean(user.is_truck_owner); // eslint-disable-line no-param-reassign
        res.status(200).send(user);
      })
      .catch(e => res.status(400).send(e.message));
  },
  delete(req, res) {
    Users.query()
      .findById(req.params.userId)
      .delete()
      .then(() => res.status(200))
      .catch(e => res.status(400).send(e.message));
  },
};

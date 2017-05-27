import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { TextField, SelectField, MenuItem, RaisedButton } from 'material-ui';
import axios from 'axios';
import { actions as userActions } from '../../redux/user';
import propSchema from '../common/PropTypes';

class ManageBasic extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      description: '',
      food_genre_id: 0,
    };
  }

  handleInfoEdit() {
    const update = {};
    if (this.state.name !== '') {
      update.name = this.state.name;
    }
    if (this.state.description !== '') {
      update.description = this.state.description;
    }
    if (this.state.food_genre_id > 0) {
      update.food_genre_id = this.state.food_genre_id;
    }
    if (Object.keys(update).length > 0) {
      axios.put(`/api/brands/${this.props.brandId}`, update)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  }

  handleReduxUpdate() {
    const newBrandInfo = Object.assign({}, this.props.user.brands[0]);
    if (this.state.name !== '') {
      newBrandInfo.name = this.state.name;
    }
    if (this.state.description !== '') {
      newBrandInfo.description = this.state.description;
    }
    if (this.state.food_genre_id > 0) {
      newBrandInfo.food_genre_id = this.state.food_genre_id;
    }
    this.props.userActions.brandInfoUpdate(newBrandInfo);
  }

  handleSave() {
    this.handleInfoEdit();
    this.handleReduxUpdate();
    this.props.getBrand(this.props.brandId);
  }

  render() {
    return (
      <div>
        <TextField
          hintText="Change Brand Name"
          onChange={(e, val) => this.setState({ name: val })}
          value={this.state.name}
        />
        <br />
        <TextField
          hintText="Change Brand Description"
          onChange={(e, val) => this.setState({ description: val })}
          value={this.state.description}
          multiLine
        />
        <br />
        <SelectField
          floatingLabelText="Change Food Genre"
          onChange={(e, i, val) => this.setState({ food_genre_id: val })}
          value={this.state.food_genre_id}
        >
          <MenuItem value={0} />
          {this.props.foodGenres.map(genre =>
            <MenuItem key={genre.id} value={genre.id} primaryText={genre.name} />,
                )}
        </SelectField>
        <br />
        <br />
        <Link to={`/brand/${this.props.brandId}/trucks`}>
          <RaisedButton
            label="Save Changes"
            onClick={() => this.handleSave()}
          />
        </Link>
      </div>
    );
  }
}

ManageBasic.propTypes = {
  brandId: propSchema.brandId,
  foodGenres: propSchema.foodGenres,
  user: propSchema.user,
  userActions: propSchema.userActions,
  getBrand: propSchema.getBrand,
};

const mapStateToProps = ({ foodGenresReducer, user }) => {
  const { foodGenres } = foodGenresReducer;
  return { foodGenres, user };
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageBasic);
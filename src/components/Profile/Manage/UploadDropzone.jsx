import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { actions as userActions } from '../../../redux/user';
import propSchema from '../../common/PropTypes';

class UploadDropzone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.upload = this.upload.bind(this);
  }

  handleDrop(file) {
    this.setState({ file });
  }

  upload(fileObj) {
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const result = event.target.result;
      axios.post(`/api/brands/${this.props.brandId}/${this.props.imageType}`, {
        userId: this.props.user.id,
        fileData: result,
      })
        .then(() =>
          setTimeout(() => {
            this.props.getBrand(this.props.brandId);
            this.props.userActions.requestUserData(this.props.user.id);
          }, 5000),
        )
        .catch(err => console.log(err));
    };

    reader.readAsDataURL(fileObj);
  }

  render() {
    const type = this.props.imageType === 'coverImage'
      ? 'cover picture'
      : 'logo';
    return (
      <div>
        <Dropzone
          accept="image/jpeg, image/png"
          multiple={false}
          onDrop={(accepted) => {
            this.handleDrop(accepted);
            this.upload(accepted[0]);
          }}
        >
          <p>Drop your picture here!</p>
        </Dropzone>
        {this.state.file.length > 0
          ? <div>{this.state.file[0].name} was successfully uploaded! Your {type} will change in a few seconds.</div>
          : null
        }
      </div>
    );
  }
}

UploadDropzone.propTypes = {
  brandId: propSchema.brandId,
  user: propSchema.user,
  getBrand: propSchema.getBrand,
  imageType: propSchema.imageType,
  userActions: propSchema.userActions,
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
});

export default connect(null, mapDispatchToProps)(UploadDropzone);

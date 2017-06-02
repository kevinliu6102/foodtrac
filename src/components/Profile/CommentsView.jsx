import React from 'react';
import { connect } from 'react-redux';
import propSchema from '../common/PropTypes';
import CommentInput from './CommentInput';
import CommentsList from './CommentsList';

const CommentsView = props => (
  <div>
    {
      (props.isLoggedIn)
      ? <CommentInput onSubmit={props.submitComment} name="newComment" />
      : null
    }
    <CommentsList
      comments={props.comments}
      userId={props.userId}
      removeComment={props.removeComment}
      editComment={props.editComment}
    />
  </div>
);

CommentsView.propTypes = {
  submitComment: propSchema.func,
  userId: propSchema.userId,
  comments: propSchema.comments,
  removeComment: propSchema.removeComment,
  editComment: propSchema.editComment,
};

const mapStateToProps = ({ auth }) => ({ isLoggedIn: auth.isLoggedIn });

CommentsView.propTypes = {
  isLoggedIn: propSchema.isLoggedIn,
};

export default connect(mapStateToProps, null)(CommentsView);
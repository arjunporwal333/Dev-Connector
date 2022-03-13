import React, { useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { GetSinglePost } from "../../flux/actions/post";
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { Link } from 'react-router-dom';

const Post = ({ GetSinglePost, post: { post, loading }, match }) => {
    useEffect(() => {
        GetSinglePost(match.params.id);
    }, [GetSinglePost, match.params.id]);
    return loading || post === null ? <Spinner /> : (
        <Fragment>
            {/* {console.log(post.comments)} */}
            <Link style={{ marginLeft: '0px' }} to="/posts" className="btn">Back To Posts</Link>

            <PostItem post={post} showActions={false} />
            <CommentForm postId={post._id} />
            <div className="comments">
                {post.comments.length > 0 ?
                    post.comments.map((comment) => (<CommentItem key={comment._id} comment={comment} postId={post._id} />))
                    :
                    null}
            </div>

        </Fragment>
    )
}

Post.propTypes = {
    GetSinglePost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { GetSinglePost })(Post)

import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { GetPosts } from "../../flux/actions/post";
import Spinner from "../layout/Spinner";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Post = ({ GetPosts, post: { posts, loading } }) => {
    useEffect(() => {
        GetPosts();
    }, [GetPosts]);
    return (
        <Fragment>
            {loading ? <Spinner />
                :
                <Fragment>
                    <h1 className="large text-primary">Posts</h1>
                    <p className="lead">
                        <i className="fas fa-user"></i>{' '}Welcome to the community
                    </p>
                    <PostForm />
                    <div className="posts">
                        {posts.map(pos => <PostItem key={pos._id} post={pos} />)}
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

Post.propTypes = {
    GetPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { GetPosts })(Post)

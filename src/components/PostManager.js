import React, { Component } from "react";
import Post from "./Post";
import shallowEqual from "../shallowEqual";
import PostEditor from "./PostEditor";
import { postsStore, FieldValue } from "../firebase";
import { AuthContext } from "./Auth";

class PostManager extends Component {
    // shouldComponentUpdate(nextProps, nextState) {
    //     return !shallowEqual(nextProps, this.props) ||
    //     (nextState.isEditingNow !== this.state.isEditingNow);
    // }
    static contextType = AuthContext;
    state = {
        isEditingNow: false
    }
    onStartEditing = () => {
        this.setState({
            isEditingNow: true
        });
    };
    onFinishEditing = () => {
        this.setState({
            isEditingNow: false
        });
    };
    onClickPostBtn = async (title, body, preview) => {
        console.log('preview: ', preview);
        await postsStore.doc(this.props.id).update({
            updatedTime: FieldValue.serverTimestamp(),
            title,
            preview,
            body
        });
        this.onFinishEditing();
    };
    render() {
        if (this.state.isEditingNow) {
            return (
                <PostEditor
                    onSubmit={this.onClickPostBtn}
                    initTitle={ this.props.title }
                    initBody={ this.props.body }
                />
            );
        }
        return (
            <Post
                { ...this.props }
                isLiked = {this.context.likes.has(this.props.id)}
                onClickEditBtn={ this.onStartEditing }
            />
        );
    }
}

export default PostManager;

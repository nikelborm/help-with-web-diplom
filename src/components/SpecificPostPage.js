/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { postsStore, postsBodysStore } from "../firebase";
import PostManager from "./PostManager";

class SpecificPostPage extends Component {
    constructor(props) {
        super(props);
        this.unsubscribePostsStore = null;
        this.unsubscribePostsBodysStore = null;
        this.isSubscribedOnPostStore = false;
    }
    state = {
        isDownloading: true,
        isExists: false
    }
    componentWillUnmount() {
        this.unsubscribePostsStore();
        this.isSubscribedOnPostStore && this.unsubscribePostsBodysStore();
    }
    componentDidMount = () => {
        const postId = this.props.computedMatch.params.postId;
        this.unsubscribePostsStore = postsStore.doc(postId).onSnapshot((postsStoreSnapshot) => {
            if (!postsStoreSnapshot.exists) {
                this.setState({
                    isDownloading: false
                });
                return;
            }
            this.setState({
                ...postsStoreSnapshot.data()
            });
            if (this.isSubscribedOnPostStore) return;
            this.unsubscribePostsBodysStore = postsBodysStore.doc(postId).onSnapshot((postsBodysStoreSnapshot) => {
                this.setState({
                    id: postId,
                    isExists: true,
                    isDownloading: false,
                    ...postsBodysStoreSnapshot.data()
                });
            });
            this.isSubscribedOnPostStore = true;
        })
    }
    render() {
        const { isExists, isDownloading, preview, id, ...post } = this.state;
        // this.props
        console.log('this.props: ', this.props.location.search);
        return (<>
            <a href="#" onClick={ this.props.history.goBack } className="topage"> Вернуться </a>
            <div className="container">
                <br/><br/><br/>
                { isDownloading
                    ? <h3>Новость загружается...</h3>
                    : isExists
                        ? <PostManager
                            id={ id }
                            post={ post }
                        />
                        : <h2> Новость не найдена </h2>
                }
            </div>
        </>);
    }
}

export default withRouter(SpecificPostPage);

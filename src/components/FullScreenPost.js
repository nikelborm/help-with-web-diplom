import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { postsStore } from "../firebase";
import PostManager from "./PostManager";

class FullScreenPost extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
    }
    state = {
        isExists: false
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    componentDidMount = () => {
        this.unsubscribe = postsStore.doc(this.props.computedMatch.params.postId).onSnapshot((snapshot) => {
            if (snapshot.exists) {
                this.setState({
                    isExists: true,
                    id: snapshot.id,
                    ...snapshot.data()
                });
            } else {
                this.setState({
                    isExists: false
                });
            }
        })
    }
    render() {
        const { isExists, id, ...post } = this.state;
        return (<>
            <a href="#" onClick={ this.props.history.goBack }> Вернуться </a>
            <div className="container">
                <br/><br/><br/>
                { isExists
                    ? <PostManager
                        id={ id }
                        isExpanded={ true }
                        { ...post}
                    />
                    : <h2> Новость не найдена </h2>
                }
            </div>
        </>);
    }
}

export default withRouter(FullScreenPost);

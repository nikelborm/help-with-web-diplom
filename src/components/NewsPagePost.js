import React, { Component } from "react";
import { postsStore, postsBodysStore } from "../firebase";
import { AuthContext } from "./Auth";
import { Link, withRouter } from "react-router-dom";
import Post from "./Post";

class NewsPagePost extends Component {
    static contextType = AuthContext;
    onClickDeleteBtn = async (event) => {
        event.preventDefault();
        try {
            await postsStore.doc(this.props.id).delete();
            await postsBodysStore.doc(this.props.id).delete();
        } catch (error) {
            alert(error);
            // TODO: уведомить пользователя об ошибке (например нельзя удалить пост так как плохое соединение) нормально, tippy
        }
    };
    onClickEditBtn = (event) => {
        event.preventDefault();
        // this.props.history
        console.log('this.props.history: ', this.props.history);
    }
    render() {
        const { id } = this.props;
        const { preview, ...post } = this.props.post;
        return (
            <Post
                { ...post }
                id={ id }
                onClickEditBtn={ this.onClickEditBtn }
                onClickDeleteBtn={ this.onClickDeleteBtn }
            >
                <p>{ preview }</p>
                <Link
                    to={ "/post/" + id }
                    className="topage"
                    children="Открыть полностью..."
                />
            </Post>
        );
    }
}
export default withRouter(NewsPagePost);

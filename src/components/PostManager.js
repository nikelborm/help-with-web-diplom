import React, { Component } from "react";
import PostEditor from "./PostEditor";
import { postsStore, FieldValue, postsBodysStore } from "../firebase";
import renderHTML from "react-render-html";
import Post from "./Post";


class PostManager extends Component {
    state = {
        isEditingNow: false,
        isLikeStateChanging: false
    }
    onClickPostBtn = async (title, body, preview) => {
        console.log('preview: ', preview);
        await postsStore.doc(this.props.id).update({
            updatedTime: FieldValue.serverTimestamp(),
            title,
            preview
        });
        await postsBodysStore.doc(this.props.id).update({
            body
        });
        this.setState({
            isEditingNow: false
        });
    };
    nothingDo = () => {};
    convertTime = function (date) {
        // TODO: Прокачать так, чтобы в зависимости от текущего времени показывался разный набор данных, чем старее, тем подробнее дата
        return new Intl.DateTimeFormat("ru", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Moscow"
        }).format(date);
    }

    onClickEditBtn = (event) => {
        event.preventDefault();
        this.setState({
            isEditingNow: true
        });
    };
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
    render() {
        const { id, post } = this.props;
        if (this.state.isEditingNow) {
            return (
                <PostEditor
                    onSubmit={ this.onClickPostBtn }
                    initTitle={ post.title }
                    initBody={ post.body }
                />
            );
        }
        return (
            <Post
                { ...post }
                id={ id }
                onClickEditBtn={ this.onClickEditBtn }
                onClickDeleteBtn={ this.onClickDeleteBtn }
            >
                <div className="ql-snow">
                    <div className="ql-editor">
                        { renderHTML(post.body) }
                    </div>
                </div>
            </Post>
        );
    }
}

export default PostManager;

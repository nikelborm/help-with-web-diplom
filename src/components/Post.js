import React, { Component } from "react";
import { ReactComponent as Heart } from "bootstrap-icons/icons/heart.svg";
import { ReactComponent as FilledHeart } from "bootstrap-icons/icons/heart-fill.svg";
import { ReactComponent as Trash } from "bootstrap-icons/icons/trash.svg";
import { ReactComponent as Edit } from "bootstrap-icons/icons/pencil-square.svg";
import { AuthContext } from "./Auth";

class Post extends Component {
    static contextType = AuthContext;
    state = {
        isLikeStateChanging: false
    }
    onClickLikeBtn = async (event) => {
        event.preventDefault();
        this.setState({
            isLikeStateChanging: true
        });
        try {
            await this.context.changeLikeState(
                this.props.isLiked ? "dislike" : "like",
                this.props.id
            );
        } catch (error) {
            alert(error);
            // TODO: уведомить пользователя об ошибке (например нельзя лайкнуть пост так как плохое соединение) нормально, tippy
        }
        this.setState({
            isLikeStateChanging: false
        });
    };
    nothingDo = () => {};
    convertTime = function (date) {
        return new Intl.DateTimeFormat("ru", {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Moscow"
        }).format(date);
    }
    render() {
        const { title, time, updatedTime, likesCounter, children } = this.props;
        const isAutorized =  !!this.context.currentUser;
        const isAdminMode =  this.context.isAdminOnlyForGUI;
        const isLiked =  this.context.likes.has(this.props.id);
        const HeartNow = isLiked ? FilledHeart : Heart;
        return (
            <div className="post">
                { isAdminMode && <Edit onClick={ this.props.onClickEditBtn } className="edit"/> }
                { isAdminMode && <Trash onClick={ this.props.onClickDeleteBtn } className="trash"/> }
                <span className={ isAdminMode ? "moved-time" : "" }>
                    { updatedTime
                        ? <> Отредактировано: { this.convertTime(updatedTime.toDate()) } </>
                        : (time && <> Опубликовано: { this.convertTime(time.toDate()) } </>)
                    }
                </span>
                <h2 className="crop-line" >Тема: { title }</h2>
                { children }
                <div className="counter">
                    <HeartNow
                        fill="red"
                        className="heart"
                        onClick={ isAutorized && !this.state.isLikeStateChanging ? this.onClickLikeBtn : this.nothingDo }
                    />
                    : { likesCounter }
                </div>
            </div>
        );
    }
}

export default Post;

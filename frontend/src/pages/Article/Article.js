import React from 'react';

import {Link, useParams} from "react-router-dom";
import "./article.css"
import getArticle from "./compotnets/getArticle"
import {useEffect, useState} from "react";
import getUserProfile from "../usersProfile/components/getUserByUsername";
import SocialLink from "../usersProfile/components/SocialLink";
import Comment from "./compotnets/Comment";
import Popup from "../../components/Popup";
import getComments from "./compotnets/getComments";
import addComment from "./compotnets/addComment";
import {userStore} from "../../store/user";

const Article = () => {
    const token = userStore(state => state.userInfo.token)

    const {id} = useParams()
    const [article, setArticle] = useState()
    const [owner, setOwner] = useState("null")
    const [loaded, setLoaded] = useState()
    const [comments, setComments] = useState()
    const [newComment, setNewComment] = useState()
    const [date,setDate] = useState()

    useEffect(() => {
        const fetch = async () => {
            const article = await getArticle(id, setArticle, setOwner)
            setArticle(article)
            const date_created = new Date(article["date_created"])
            setDate(`${monthNames[date_created.getDate()]} ${date_created.getMonth()},`)
            const userProfile = await getUserProfile(article.owner);
            setOwner(userProfile)
            const comments = await getComments(article.id)
            setComments(comments)
            setLoaded(true)
        }
        fetch()
    }, [])


    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    const addComment_ = async () => {
        if (newComment) {
            await getComments(article.id)
            await addComment(article.id, newComment, article.owner,token)
            setNewComment("")
            const comments = await getComments(article.id)
            setComments(comments)

        }
    }


    return (
        article && article.title && loaded ? <>
            <div className={"articleContainer col-full s-content__main"}>
                <header className="articleHeader">
                    <h1 className={"articleTitle"}>
                        {article.title}
                    </h1>
                    <div className={"underTitle"}>
                    <span
                        className={"articleData"}>{date}</span>
                        <span className={"articleCathegory"}>In «{article.category}»</span>
                    </div>
                </header>
                <main className={"articleMain"}>
                    <div className={"article"}
                         dangerouslySetInnerHTML={{__html: article ? article.text : "null"}}></div>
                </main>
                <div className="author_article">
                    <div className="s-content__author">
                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt=""/>
                        <div className="s-content__author-about">
                            <h4 className="s-content__author-name">
                                <Link to={`/users/${owner.username}`}>@{owner.username}</Link>
                                <p>{owner.job}</p>
                            </h4>

                            <p>
                                {owner.description}
                            </p>

                            <ul className="s-content__author-social">

                                <SocialLink link={owner.github_link} name={"gitHub"}/>
                                <SocialLink link={owner.instagram_link} name={"instagram"}/>

                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <footer className="comments">
                <div className="comments-wrap">

                    <div id="comments" className="row">
                        <div className="col-full">
                            {comments && !comments.status ?
                                <>
                                    <h3 className="h2"> {comments.length} Comments</h3>

                                    <ol className="commentlist">
                                        {comments.map(comment => {
                                            const date_created = new Date(comment.date_created)
                                            const date = `${monthNames[date_created.getMonth()]} ${date_created.getDate()} @ ${date_created.getHours()}:${date_created.getMinutes()}`
                                            return <Comment date={date}
                                                            commentValue={comment.comment_value}
                                                            username={comment.owner}/>
                                        })}
                                    </ol>
                                </> : <h1>No comments yet</h1>
                            }
                            <div className="respond">

                                <h3 className="h2">Add Comment</h3>
                                <div>
                                    <div className="message form-field">
                                            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                                      name="cMessage" id="cMessage" className="full-width"
                                                      placeholder="Your Message"></textarea>
                                    </div>

                                    <button onClick={addComment_}
                                            className="submit btn--primary btn--large full-width">Submit
                                    </button>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </footer>
        </> : <>{loaded ? <Popup/> : null}</>
    )
}
export default Article
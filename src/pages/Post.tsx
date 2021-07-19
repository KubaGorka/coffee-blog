import React, { useState, useEffect } from "react";
import styles from "./styles/Post.module.scss";
import { useParams } from "react-router-dom";
import { IPost } from "../interfaces/IPost";
import { db, fetchImageURLbyId } from "../firebaseSetup";

//TODO:
//Get html-react-parser to work

type PostParams = {
  postId: string;
};

const Post = () => {
  const [post, setPost] = useState<IPost>({} as IPost);
  const { postId } = useParams<PostParams>(); //gets object with postId field

  useEffect(() => {
    db.collection("blog")
      .doc(postId)
      .get()
      .then((doc) => {
        return fetchImageURLbyId(doc);
      })
      .then((newDoc) => {
        setPost(newDoc as IPost);
      });
  }, [postId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={post.Image} alt="PostPicture" />
        <h1>{post.Name}</h1>
      </div>
      <div className={styles.content}>
        <p>{post.Content}</p>
      </div>
    </div>
  );
};

export default Post;

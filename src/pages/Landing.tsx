import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import styles from "./styles/Landing.module.scss";

import firebase from "firebase/app";
import "firebase/storage";
import LoadingSpinner from "../components/LoadingSpinner";

interface IPost {
  ID: string;
  Author: string;
  Content: string;
  Image: string;
  Name: string;
  Date: number;
}

const Landing = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const pageSize = 7;

  


  useEffect(() => {
    let isMounted = true;
    const db = firebase.firestore();
    const storage = firebase.storage();
    const storageRef = storage.ref();

    const getImageURL = async (
      doc: firebase.firestore.DocumentData
    ): Promise<IPost> => {
      let data = doc.data() as IPost;
      data.ID = doc.id;
      return await storageRef
        .child(data.Image)
        .getDownloadURL()
        .then((url) => {
          data.Image = url;
          return data;
        })
        .catch(() => {
          console.log("Image not found for", data.Image);
          return data;
        });
    };

    const getPosts = () => {
      return db
        .collection("blog")
        .orderBy("Date", "desc")
        .limit(pageSize)
        .get()
        .then((querySnapshot) => {
          let snapshotsArray: firebase.firestore.DocumentData[] = [];
          querySnapshot.forEach((doc) => {
            snapshotsArray.push(doc);
          });
          return snapshotsArray.map((doc) => getImageURL(doc));
        })
        .then((arr) => {
          return Promise.all(arr);
        });
    };

    getPosts()
      .then((posts) => {
        if (isMounted) {
          setLoading(false);
          setPosts([...posts]);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner loading={true} />
      ) : (
        <div className={styles.container}>
          {posts.map((post, idx) => {
            return idx === 0 ? (
              <Link to={`/post/${post.ID}`} key={post.ID}>
                <PostCard
                  first={true}
                  title={post.Name}
                  image={post.Image}
                  date={post.Date}
                />
              </Link>
            ) : (
              <Link to={`/post/${post.ID}`} key={post.ID}>
                <PostCard
                  first={false}
                  title={post.Name}
                  image={post.Image}
                  date={post.Date}
                />
              </Link>
            );
          })}
          <button>
            <Link to="/blog">See all posts</Link>
          </button>
        </div>
      )}
    </>
  );
};

export default Landing;

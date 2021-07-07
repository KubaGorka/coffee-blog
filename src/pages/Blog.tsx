import React, { useState, useEffect } from "react";
import styles from "./styles/Blog.module.scss";
import { useAuth } from "../context/AuthContext";

import firebase from "firebase/app";
import "firebase/storage";

import LoadingSpinner from "../components/LoadingSpinner";
import { ReactComponent as ArrowLeft } from "../assets/svg/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "../assets/svg/ArrowRight.svg";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

interface IPost {
  ID: string;
  Author: string;
  Content: string;
  Image: string;
  Name: string;
  Date: number;
}

const Blog = () => {
  const [posts, setPosts] = useState<firebase.firestore.DocumentData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastDocument, setLastDocument] =
    useState<firebase.firestore.DocumentData>();
  const [firstDocument, setFirstDocument] =
    useState<firebase.firestore.DocumentData>();

  const { currentUser } = useAuth();

  const pageSize = 6;
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();

  const getImageURL = async (
    doc: firebase.firestore.DocumentData
  ): Promise<firebase.firestore.DocumentData> => {
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

  const getInitialPosts = (): Promise<firebase.firestore.DocumentData[]> => {
    return db
      .collection("blog")
      .orderBy("Date", "desc")
      .limit(pageSize)
      .get()
      .then((querySnapshot) => {
        let snapshotsArray: firebase.firestore.DocumentData[] = [];
        setFirstDocument(querySnapshot.docs[0]);
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
        querySnapshot.forEach((doc) => {
          snapshotsArray.push(doc);
        });
        return snapshotsArray.map((doc) => getImageURL(doc));
      })
      .then((arr) => {
        return Promise.all(arr);
      });
  };

  const getNextPage = (): Promise<firebase.firestore.DocumentData[]> => {
    return db
      .collection("blog") // Get X newest posts from firebase
      .orderBy("Date", "desc")
      .startAfter(lastDocument)
      .limit(pageSize)
      .get()
      .then((querySnapshot) => {
        let snapshotsArray: firebase.firestore.DocumentData[] = [];
        setFirstDocument(querySnapshot.docs[0]);
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
        querySnapshot.forEach((doc) => {
          snapshotsArray.push(doc);
        });
        return snapshotsArray.map((doc) => getImageURL(doc));
      })
      .then((arr) => {
        return Promise.all(arr);
      });
  };

  const getPreviousPage = (): Promise<firebase.firestore.DocumentData[]> => {
    return db
      .collection("blog") // Get X newest posts from firebase
      .orderBy("Date", "desc")
      .endBefore(firstDocument)
      .limitToLast(pageSize)
      .get()
      .then((querySnapshot) => {
        let snapshotsArray: firebase.firestore.DocumentData[] = [];
        setFirstDocument(querySnapshot.docs[0]);
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
        querySnapshot.forEach((doc) => {
          snapshotsArray.push(doc);
        });
        return snapshotsArray.map((doc) => getImageURL(doc));
      })
      .then((arr) => {
        return Promise.all(arr);
      });
  };

  useEffect(() => {
    let isMounted = true;

    db.collection("blog")
      .get()
      .then((snap) => {
        setSize(Math.ceil(snap.size / pageSize));
      });

    getInitialPosts().then((values) => {
      if (isMounted) {
        setPosts([...values]);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      {currentUser && <button className={styles.button}>Add new post</button>}

      {loading ? (
        <LoadingSpinner loading={loading} />
      ) : (
        <>
          <div className={styles.posts}>
            {posts.map((post, index) => {
              return (
                <div key={index}>
                  <Link to={`/post/${post.ID}`}>
                    <PostCard
                      first={false}
                      title={post.Name}
                      image={post.Image}
                      date={post.Date}
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={styles.navigation}>
            
            {page !== 1 ? (
              <ArrowLeft
                onClick={() => {
                  setPage(page - 1);
                  getPreviousPage()
                    .then((values) => {
                      setPosts(() => [...values]);
                    })
                    .catch((err) => console.log(err));
                }}
              />
            ) : <span className={styles.filler}> </span>}

            {page !== size ? (
              <ArrowRight
                onClick={() => {
                  setPage(page + 1);
                  getNextPage()
                    .then((values) => {
                      setPosts(() => [...values]);
                    })
                    .catch((err) => console.log(err));
                }}
              />
            ) : <span className={styles.filler}> </span>}

          </div>
        </>
      )}
    </div>
  );
};

export default Blog;

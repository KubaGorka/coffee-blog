import React, { useState, useRef } from "react";

import { INewPost } from "../interfaces/IPost";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebaseSetup";
import { Redirect, useHistory } from "react-router-dom";
import styles from "./styles/NewPost.module.scss";

const NewPost = () => {
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string | boolean>();

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const history = useHistory();
  const { currentUser } = useAuth();

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    if (!currentUser) {
      setError("You must be logged in to add a post.");
      setLoading(false);

      return;
    }

    if (!validateForm()) {
      setLoading(false);

      return;
    }
    if (
      titleRef.current &&
      contentRef.current &&
      fileRef.current &&
      fileRef.current.files
    ) {
      addPostToCollection({
        Name: titleRef.current.value,
        Content: contentRef.current.value,
        Image: fileRef.current.files[0],
      });
    }
  }

  function validateForm(): boolean {
    //check title and content fields
    if (titleRef.current && contentRef.current) {
      //Typescript check
      if (
        titleRef.current.value.length === 0 ||
        contentRef.current.value.length === 0
      ) {
        setError("Please fill all the fields.");
        return false;
      }
    }

    //check if image is uploaded
    if (fileRef.current) {
      if (!fileRef.current.files || fileRef.current.files[0] === undefined) {
        setError("Please upload an image");
        return false;
      }
    }

    return true;
  }

  function addPostToCollection(post: INewPost) {
    db.collection("stories")
      .add({
        Author: currentUser?.uid,
        Image: "",
        Name: titleRef.current?.value,
      })
      .then((docRef) => {
        if (fileRef.current?.files && fileRef.current.files.length > 0) {
          let newFileRef = storage.ref().child(docRef.id);
          newFileRef.put(fileRef.current.files[0]);
          return docRef;
        }
      })
      .then((docRef) => {
        if (docRef) {
          db.collection("stories")
            .doc(docRef.id)
            .update({
              Image: `${docRef.id}`,
            });
          return docRef;
        }
      })
      .then((docRef) => {
        if (docRef) {
          db.collection("blog")
            .add({
              Author: currentUser?.uid,
              Name: titleRef.current?.value,
              Image: `${docRef.id}`,
              Content: contentRef.current?.value,
              Date: new Date().getTime(),
            })
            .then((doc) => {
              history.push(`/post/${doc.id}`);
            });
        }
      })
      .catch((error) => {
        console.error("Could not add new post: ", error);
        setLoading(false);
      });
  }

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.container}>
      <h1>Add new post</h1>
      <form onSubmit={(e) => submitForm(e)} className={styles.form}>
        <div>
          <label htmlFor="title">Post title</label>
          <input type="text" name="title" ref={titleRef} />
        </div>
        <div>
          <label htmlFor="image">Image</label>
          <input
            name="iamge"
            type="file"
            accept="image/png, image/jpeg"
            ref={fileRef}
          />
        </div>
        <div>
          <label htmlFor="content">Post content</label>
          <textarea name="content" ref={contentRef}></textarea>
        </div>
        {error && <p>{error}</p>}
        <input type="submit" value={loading ? "Loading..." : "Add"} />
      </form>
    </div>
  );
};

export default NewPost;

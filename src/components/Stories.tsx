import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/Stories.module.scss";

import { useAuth } from "../context/AuthContext";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

const Stories = () => {
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [error, setError] = useState("");

  const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const { currentUser }: { currentUser: firebase.User } = useAuth();
  const pageSize = 20;
  const db = firebase.firestore();
  const storageRef = firebase.storage().ref();

  const getURLs = () => {
    storageRef
      .child("")
      .list({ maxResults: pageSize })
      .then((res) => {
        res.items.forEach((itemRef) => {
          itemRef
            .getDownloadURL()
            .then((url) => {
              setImageURLs((imageURLs) => [...imageURLs, url]);
            })
            .catch((error) => {
              console.log("Could not get URL");
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addNewStory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameRef.current.value) {
      if (fileRef.current.files && fileRef.current.files.length > 0) {
        const filetype = fileRef.current.files[0].name.split(".").splice(-1);
        db.collection("stories")
          .add({
            Author: currentUser.uid,
            Image: "",
            Name: nameRef.current.value,
          })
          .then((docRef) => {
            if (fileRef.current.files && fileRef.current.files.length > 0) {
              let newFileRef = storageRef.child(docRef.id);
              newFileRef.put(fileRef.current.files[0]).then((snapshot) => {
                console.log("Uploaded a blob or file!");
              });
              return docRef;
            }
          })
          .then((docRef) => {
            if (docRef) {
              db.collection("stories")
                .doc(docRef.id)
                .update({
                  Image: `${docRef.id}.${filetype}`,
                });
            }
          })
          .catch((error) => {
            console.error("Could not add new image: ", error);
          });
      } else {
        setError("Please upload an image");
        return;
      }
    } else {
      setError("Please add a name");
      return;
    }
  };

  useEffect(() => {
    getURLs();
  }, []);

  return (
    <div className={styles.container}>
      {currentUser ? (
        <div className={styles.addStory}>
          <h3>Add new story</h3>
          <form onSubmit={(e) => addNewStory(e)}>
            <label>Name:</label>
            <input type="text" ref={nameRef} onChange={() => setError("")} />
            <label>File:</label>

            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileRef}
              onChange={() => setError("")}
            />
            <input type="submit" value="Add" />
          </form>
          {error !== "" ? <p className="error">{error}</p> : null}
        </div>
      ) : null}

      {imageURLs.map((url, index) => {
        return <img src={url} alt="Coffee" key={index} />;
      })}
    </div>
  );
};

export default Stories;

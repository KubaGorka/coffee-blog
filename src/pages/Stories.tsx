import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/Stories.module.scss";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebaseSetup";

import LoadingSpinner from "../components/LoadingSpinner";

// TODO:
// add image upload date to sort them

const Stories = () => {
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<number>(0);

  const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const { currentUser } = useAuth();

  const pageSize = 20;

  const addNewStory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameRef.current.value) {
      setError("Please add a name");
      return;
    }

    if (!fileRef.current.files || fileRef.current.files[0] === undefined) {
      setError("Please upload an image");
      return;
    }

    const filetype = fileRef.current.files[0].name.split(".").splice(-1);

    if (currentUser) {
      db.collection("stories")
        .add({
          Author: currentUser.uid,
          Image: "",
          Name: nameRef.current.value,
        })
        .then((docRef) => {
          if (fileRef.current.files && fileRef.current.files.length > 0) {
            let newFileRef = storage.ref().child(docRef.id);
            newFileRef.put(fileRef.current.files[0]).then((snapshot) => {
              console.log("Uploaded!");
            });
            return docRef;
          }
        })
        .then((docRef) => {
          nameRef.current.value = "";
          fileRef.current.value = "";
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
    }
  };

  useEffect(() => {
    const getURLs = () => {
      storage
        .ref()
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
          setError(error);
        })
        .finally(() => setLoading(false));
    };

    if (loading) getURLs();
  }, [loading]);

  useEffect(() => {
    function setNumberOfColumns() {
      setColumns(Math.floor(containerRef.current.offsetWidth / 450) + 1);
    }
    setNumberOfColumns();

    window.addEventListener("resize", setNumberOfColumns);

    return () => {
      window.removeEventListener("resize", setNumberOfColumns);
    };
  }, []);

  return (
    <>
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
      <LoadingSpinner
        color="#6A6A6A"
        height="4rem"
        width=".5rem"
        loading={loading}
      />
      <div className={styles.container} ref={containerRef}>
        {Array(columns)
          .fill(null)
          .map((_, index) => {
            return (
              <div key={`column-${index}`} className={styles.column}>
                {imageURLs
                  .filter((x, i) => i % columns === index)
                  .map((url, index2) => {
                    return <img src={url} alt="Coffee" key={index2} />;
                  })}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Stories;

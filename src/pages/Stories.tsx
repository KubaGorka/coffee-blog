import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/Stories.module.scss";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebaseSetup";

import LoadingSpinner from "../components/LoadingSpinner";

const Stories = () => {
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<number>(0);

  const nameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const pageTokenRef = useRef<string | null | undefined>(undefined);

  const { currentUser } = useAuth();

  const pageSize = 10;

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
    const getURLs = (): Promise<string[]> => {
      return storage
        .ref()
        .list({ maxResults: pageSize, pageToken: pageTokenRef.current })
        .then((res) => {
          pageTokenRef.current = res.nextPageToken;

          const promisses: Promise<string>[] = res.items.map((item) => {
            return item.getDownloadURL();
          });

          return Promise.all(promisses);
        })
        .finally(() => setLoading(false));
    };

    if (loading && pageTokenRef.current !== null) {
      getURLs().then((res) => {
        setImageURLs((imageURLs) => [...imageURLs, ...res]);
      });
    }
  }, [loading]);

  //Listeners for number of columns and fetching more data
  useEffect(() => {
    function setNumberOfColumns() {
      setColumns(Math.floor(containerRef.current.offsetWidth / 450) + 1);
    }
    setNumberOfColumns();

    function checkIfNearBottom() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (pageTokenRef.current !== null) {
          setLoading(true);
        }
      }
    }

    window.addEventListener("resize", setNumberOfColumns);
    window.addEventListener("scroll", checkIfNearBottom);

    return () => {
      window.removeEventListener("resize", setNumberOfColumns);
      window.removeEventListener("scroll", checkIfNearBottom);
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

      <LoadingSpinner
        color="#6A6A6A"
        height="4rem"
        width=".5rem"
        loading={loading && pageTokenRef.current ? true : false}
      />
    </>
  );
};

export default Stories;

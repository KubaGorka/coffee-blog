import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./styles/Account.module.scss";
import { Redirect, useHistory } from "react-router-dom";
import { db } from "../firebaseSetup";

import firebase from "firebase/app";
import User from "../assets/svg/User.svg";
import SignOut from "../assets/svg/SignOut.svg";

// TODO:
// Add 'Edit profile' button

const Account = () => {
  const [numberOfPosts, setnumberOfPosts] = useState<number>();
  const [numberOfStories, setnumberOfStories] = useState<number>();
  const [error, setError] = useState("");

  const { currentUser, signOut } = useAuth();
  const history = useHistory();

  function logOut() {
    signOut()
      .then(() => {
        history.push("/");
      })
      .catch((err: firebase.FirebaseError) => {
        setError(err.message);
      });
  }

  useEffect(() => {
    const getNumberOfUserEntriesFromCollection = async (
      collectionName: string
    ): Promise<number> => {
      return db
        .collection(collectionName)
        .where("Author", "==", currentUser?.uid)
        .get()
        .then((snapshot) => {
          return snapshot.size;
        });
    };

    if (currentUser) {
      getNumberOfUserEntriesFromCollection("blog").then((value) => {
        setnumberOfPosts(value);
      });
      getNumberOfUserEntriesFromCollection("stories").then((value) => {
        setnumberOfStories(value);
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <>
      {error && <p>{error}</p>}
      <div className={styles.container}>
        <div className={styles.top}>
          <h1>Profile</h1>

          <div className={styles.button} onClick={() => logOut()}>
            <p>Sign out</p>
            <img src={SignOut} alt="Sign Out" />
          </div>
        </div>

        <img src={User} alt="User avatar" className={styles.avatar} />

        <div className={styles.information}>
          <p>{currentUser?.email}</p>
          <div className={styles.stats}>
            <p>Posts: {numberOfPosts}</p>
            <p>Stories: {numberOfStories}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;

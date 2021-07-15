import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./styles/Account.module.scss";
import { Redirect, useHistory } from "react-router-dom";
import firebase from "firebase";

import User from "../assets/svg/User.svg";
import SignOut from "../assets/svg/SignOut.svg";
import Edit from "../assets/svg/Edit.svg";

const Account = () => {
  const [error, setError] = useState("");

  const { currentUser, signOut } = useAuth();
  const history = useHistory();

  async function logOut() {
    await signOut()
      .then(() => {
        history.push("/");
      })
      .catch((err: firebase.FirebaseError) => {
        setError(err.message);
      });
  }

  if (!currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <>
      {error && <p>{error}</p>}
      <div className={styles.container}>
        <h1>Profile</h1>
        <div className={styles.buttons}>
          <img src={Edit} alt="Edit" className={styles.button} />
          <img
            src={SignOut}
            alt="Sign Out"
            onClick={() => logOut()}
            className={styles.button}
          />
        </div>
        <img src={User} alt="User avatar" className={styles.avatar} />
        <div className={styles.statistics}>
          <h3>Statistics</h3>
          <p>Posts:</p>
          <p>Stories:</p>
        </div>
        <div className={styles.information}>
          <h3>Information</h3>
          <p>Email: {currentUser?.email}</p>
        </div>
      </div>
    </>
  );
};

export default Account;

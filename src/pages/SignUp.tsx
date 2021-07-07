import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles/Sign.module.scss";
import { useAuth } from "../context/AuthContext";
import firebase from "firebase/app";
import SignField from "../components/SignField";

const SignUp = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { signUp } = useAuth();

  const db = firebase.firestore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (passwordValue !== passwordConfirmValue) {
      setLoading(false);
      setError(`Passwords don't match`);
      return;
    }

    await signUp(emailValue, passwordValue)
      .then((credentials: any) => {
        console.log(credentials);
        db.collection("users").doc(credentials.user.uid).set({
          email: credentials.user.email,
          userID: credentials.user.uid,
          username: credentials.user.email,
        });
        console.log("collection set?");
      })
      .then(() => {
        setMessage("Account has been created! You can sign in now.");
      })
      .catch((err: firebase.FirebaseError) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logo}>
        <h1>caffeine.</h1>
        <p>Just another coffee blog</p>
      </Link>
      <form onSubmit={(e) => handleSubmit(e)}>
        <SignField
          label="Login"
          changeValue={setEmailValue}
          type="email"
          value={emailValue}
          clearError={setError}
        />

        <SignField
          label="Password"
          changeValue={setPasswordValue}
          type="password"
          value={passwordValue}
          clearError={setError}
        />

        <SignField
          label="Confirm password"
          changeValue={setPasswordConfirmValue}
          type="password"
          value={passwordConfirmValue}
          clearError={setError}
        />

        <input type="submit" value="Sign up" disabled={loading} />
        {error !== "" ? <p className="error">{error}</p> : null}
        {message !== "" ? <p className="message">{message}</p> : null}
        <Link to="/signin">Already a member? Sign in</Link>
      </form>
    </div>
  );
};

export default SignUp;

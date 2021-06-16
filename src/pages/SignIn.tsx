import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles/Sign.module.scss";
import { useAuth } from "../context/AuthContext";
import firebase from "firebase/app";
import SignField from "../components/SignField";

const SignIn = () => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await signIn(emailValue, passwordValue)
      .then(() => {
        history.push("/");
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

        <input type="submit" value="Sign in" disabled={loading} />
        {error !== "" ? <p className="error">{error}</p> : null}
        <Link to="/signup">Need an account? Sign up</Link>
      </form>
    </div>
  );
};

export default SignIn;

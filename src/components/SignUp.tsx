import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles/Sign.module.scss";
import { useAuth } from "../context/AuthContext";
import firebase from "firebase";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const emailValue = useRef<HTMLInputElement | null>(null);
  const passwordValue = useRef<HTMLInputElement | null>(null);
  const passwordConfirmValue = useRef<HTMLInputElement | null>(null);

  const { signUp, currentUser } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (passwordValue.current?.value !== passwordConfirmValue.current?.value) {
      setLoading(false);
      setError(`Passwords don't match`);
      return;
    }

    await signUp(emailValue.current?.value, passwordValue.current?.value)
      .then(() => {
        setMessage('Account has been created!')
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
        <div>
          <label>Login</label>
          <input
            required
            ref={emailValue}
            type="email"
            onChange={() => {
              if (error !== "") {
                setError("");
              }
            }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            ref={passwordValue}
            required
            type="password"
            onChange={() => {
              if (error !== "") {
                setError("");
              }
            }}
          />
        </div>
        <div>
          <label>Confirm password</label>
          <input
            ref={passwordConfirmValue}
            required
            type="password"
            onChange={() => {
              if (error !== "") {
                setError("");
              }
            }}
          />
        </div>
        <input type="submit" value="Sign up" disabled={loading} />
        {error !== "" ? <p className='error'>{error}</p> : null}
        {message !== "" ? <p className='message'>{message}</p> : null}
        <Link to="/signin">Already a member? Sign in</Link>
      </form>
    </div>
  );
};

export default SignUp;

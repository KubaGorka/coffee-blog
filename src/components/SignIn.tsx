import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles/Sign.module.scss";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailValue = useRef<HTMLInputElement | null>(null);
  const passwordValue = useRef<HTMLInputElement | null>(null);

  const { signIn } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await signIn(emailValue.current?.value, passwordValue.current?.value)
      .then((result: any) => {
        history.push("/");
      })
      .catch((err: any) => {
        setLoading(false);
        setError("Invalid username or password");
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
            ref={emailValue}
            required
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
          <p>Forgot passowrd?</p>
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
        <input type="submit" value="Sign in" disabled={loading} />
        {error !== "" ? <p className='error'>{error}</p> : null}
        <Link to="/signup">Need an account? Sign up</Link>
      </form>
    </div>
  );
};

export default SignIn;

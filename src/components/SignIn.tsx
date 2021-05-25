import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles/Sign.module.scss";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, currentUser } = useAuth();
  const history = useHistory();

  if (currentUser !== null) {
    history.push("/");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await signIn(formEmail, formPassword)
      .then((result: any) => {})
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
            required
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <p>Forgot passowrd?</p>
          <input
            required
            type="password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
          />
        </div>
        <input type="submit" value="Sign in" disabled={loading} />
        {error !== "" ? <p>{error}</p> : null}
        <Link to="/signup">Need an account? Sign up</Link>
      </form>
    </div>
  );
};

export default SignIn;

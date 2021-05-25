import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./styles/Sign.module.scss";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setformConfirmPassword] = useState("");
  const [passwordMatch, setFormPasswordMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp, currentUser } = useAuth();
  const history = useHistory();

  if (currentUser !== null) {
    history.push("/");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!passwordMatch) {
      setLoading(false);
      setError(`Passwords don't match`);
      return;
    }

    await signUp(formEmail, formPassword)
      .then((result: any) => {
        history.push("/signin");
      })
      .catch((err: any) => {
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
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            required
            type="password"
            value={formPassword}
            onChange={(e) => {
              setFormPassword(e.target.value);
              setFormPasswordMatch(formPassword === formConfirmPassword);
            }}
          />
        </div>
        <div>
          <label>Confirm password</label>
          <input
            required
            type="password"
            onChange={(e) => {
              setformConfirmPassword(e.target.value);
              setFormPasswordMatch(formPassword === formConfirmPassword);
            }}
          />
        </div>
        <input type="submit" value="Sign up" disabled={loading} />
        {error !== "" ? <p>{error}</p> : null}
        <Link to="/signin">Already a member? Sign in</Link>
      </form>
    </div>
  );
};

export default SignUp;

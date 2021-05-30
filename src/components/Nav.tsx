import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import styles from "./styles/Nav.module.scss";

import { ReactComponent as Facebook } from "../assets/svg/Facebook.svg";
import { ReactComponent as Instagram } from "../assets/svg/Instagram.svg";
import { ReactComponent as Twitter } from "../assets/svg/Twitter.svg";
import { ReactComponent as User } from "../assets/svg/User.svg";

const Nav = () => {
  const { currentUser } = useAuth();

  return (
    <div className={`${styles.container} Nav`}>
      <div className={styles.social}>
        <a href="https://www.facebook.com/">
          <Facebook />
        </a>
        <a href="https://instagram.com/">
          <Instagram />
        </a>
        <a href="https://twitter.com/">
          <Twitter />
        </a>
      </div>

      <Link to="/" className={styles.logo}>
        <h1>caffeine.</h1>
        <p>Just another coffee blog</p>
      </Link>

      <div className={styles.login}>
        {currentUser !== null && currentUser !== undefined ? (
          <>
            <p className={styles.username}>Hello, {currentUser.email}</p>
            <Link to="/account">
              <User />
            </Link>
          </>
        ) : (
          <Link to="/signin">
            <User />
          </Link>
        )}
      </div>

      <ul className={styles.menu}>
        <Link to="/">
          <li>Home</li>
        </Link>
        <Link to="/stories">
          <li>Stories</li>
        </Link>
        <Link to="/blog">
          <li>Blog</li>
        </Link>
        <Link to="/about">
          <li>About</li>
        </Link>
      </ul>
    </div>
  );
};

export default Nav;

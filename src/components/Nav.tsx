import React from "react";
import { NavLink } from "react-router-dom";
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

      <NavLink to="/" className={styles.logo}>
        <h1>caffeine.</h1>
        <p>Just another coffee blog</p>
      </NavLink>

      <div className={styles.login}>
        {currentUser !== null && currentUser !== undefined ? (
          <>
            <p className={styles.username}>Hello, {currentUser.email}</p>
            <NavLink to="/account">
              <User />
            </NavLink>
          </>
        ) : (
          <NavLink to="/signin">
            <User />
          </NavLink>
        )}
      </div>

      <ul className={styles.menu}>
        <NavLink to="/" activeClassName={styles.active}>
          <li>Home</li>
        </NavLink>
        <NavLink to="/stories" activeClassName={styles.active}>
          <li>Stories</li>
        </NavLink>
        <NavLink to="/blog" activeClassName={styles.active}>
          <li>Blog</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Nav;

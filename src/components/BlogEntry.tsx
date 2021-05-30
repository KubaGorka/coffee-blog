import React from "react";
import styles from "./styles/BlogEntry.module.scss";

interface IProps {
  landing: boolean;
  name: string;
  author: string;
  image: string;
}

const BlogEntry: React.FC<IProps> = ({ ...props }) => {
  return (
    <div className={props.landing ? styles.landing : styles.post}>
      {props.landing ? (
        <div className={styles.imageContainer}>
          <img src={props.image} alt="blogimage" />
        </div>
      ) : (
        <img src={props.image} alt="blogimage" />
      )}

      <div>
        <h3>{props.name}</h3>
        <p>By {props.author}</p>
      </div>
    </div>
  );
};

export default BlogEntry;

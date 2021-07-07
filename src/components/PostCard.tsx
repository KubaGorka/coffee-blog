import React from "react";
import styles from "./styles/LandingPost.module.scss";

interface IProps {
  first: boolean;
  title: string;
  image: string;
  date: number;
}

function getDateFromNumber(value: number): string {
  let date = new Date(value);
  return date.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
}

const PostCard: React.FC<IProps> = ({ ...props }) => {
  return (
    <div className={`${props.first === true ? styles.primary : styles.secondary} ${styles.post}`}>
      <img src={props.image} alt="Blog entry topic previev" />
      <div className={styles.content}>
        <p className={styles.date}>{getDateFromNumber(props.date)}</p>
        <h1 className={styles.title}>{props.title}</h1>
      </div>
    </div>
  );
};

export default PostCard;

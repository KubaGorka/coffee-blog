import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { IPost } from "./interfaces/IPost";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();

const auth = app.auth();
const db = app.firestore();
const storage = app.storage();

// TODO:
// Put functions there to remove code repetition

// const uploadImage = () => {};

// const addNewPost = () => {};

// const fetchPosts = () => {};

export const fetchImageURLbyId = (
  doc: firebase.firestore.DocumentData
): Promise<firebase.firestore.DocumentData> => {
  let data = doc.data() as IPost;
  return storage
    .ref()
    .child(data.Image)
    .getDownloadURL()
    .then((url) => {
      data.Image = url;
      return data;
    })
    .catch((err) => {
      console.log("Image not found for", data.Image);
      return data;
    });
};


export { app, auth, db, storage };
export default app;

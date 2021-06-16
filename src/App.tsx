import React, { useState, useEffect } from "react";
import "./styles/styles.scss";

import Nav from "./components/Nav";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import BlogEntry from "./components/BlogEntry";
import Account from "./pages/Account";
import Stories from "./pages/Stories";

import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

interface IPost {
  ID: string;
  Author: string;
  Content: string;
  Image: string;
  Name: string;
  Date: number;
}

function App() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const numberOfPosts = 5;

  useEffect(() => { //
    const db = firebase.firestore();
    const storage = firebase.storage();
    const storageRef = storage.ref();

    const getPosts = () => {
      db.collection("blog") // Get X newest posts from firebase
        .orderBy("Date", "desc")
        .limit(numberOfPosts)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let data = doc.data() as IPost;
            data.ID = doc.id;
            storageRef
              .child(data.Image)
              .getDownloadURL()
              .then((url) => {
                data.Image = url;
                setPosts((posts) => [...posts, data]);
              })
              .catch(() => {
                console.log("Image not found for", data.Image);
              });
          });
        });
    };

    getPosts();
  }, [setPosts]);

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/signup"></Route>
            <Route path="/signin"></Route>
            <Route path="/">
              <Nav />
            </Route>
          </Switch>

          <Switch>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/account">
              <Account />
            </Route>
            <Route path="/about"></Route>
            <Route path="/stories">
              <Stories />
            </Route>
            <Route path="/blog"></Route>

            <Route path="/"> 
              {posts.map((post, index) => {
                return (
                  <Link to={`/post/${post.ID}`} key={index}>
                    <BlogEntry
                      landing={index === 0 ? true : false}
                      name={post.Name}
                      author={post.Author}
                      image={post.Image}
                    />
                  </Link>
                );
              })}
              <Link to="/blog" className="blogLink">
                View more posts
              </Link>
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
      <p className="copyright">&copy; Jakub Gorka 2021</p>
    </div>
  );
}

export default App;

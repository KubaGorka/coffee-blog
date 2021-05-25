import React from "react";
import { AuthProvider } from "./context/AuthContext";
import Nav from "./components/Nav";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import BlogEntry from "./components/BlogEntry";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./styles/styles.scss";
import Account from "./components/Account";

function App() {
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
            <Route path="/stories"></Route>
            <Route path="/blog"></Route>

            <Route path="/">
              {
                // This will be latest fetched posts
              }
              <BlogEntry
                landing={true}
                name="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                author="Jan Kowalski"
              />
              <BlogEntry
                landing={false}
                name="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                author="Jan Kowalski"
              />
              <BlogEntry
                landing={false}
                name="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                author="Jan Kowalski"
              />
              <BlogEntry
                landing={false}
                name="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                author="Jan Kowalski"
              />
              <BlogEntry
                landing={false}
                name="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                author="Jan Kowalski"
              />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

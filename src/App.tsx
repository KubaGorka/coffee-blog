import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
//import { FirebaseProvider } from "./context/FirebaseContext";
import "./styles/styles.scss";

import Nav from "./components/Nav";
import LoadingSpinner from "./components/LoadingSpinner";
import Landing from "./pages/Landing";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Account = lazy(() => import("./pages/Account"));
const Stories = lazy(() => import("./pages/Stories"));
const Blog = lazy(() => import("./pages/Blog"));
const About = lazy(() => import("./pages/About"));

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/signup" />
            <Route path="/signin" />
            <Route path="/">
              <Nav />
            </Route>
          </Switch>

          <Suspense fallback={<LoadingSpinner loading={true} />}>
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

              <Route path="/stories">
                <Stories />
              </Route>

              <Route path="/about">
                <About />
              </Route>

              <Route path="/blog">
                <Blog />
              </Route>

              <Route path="/post"></Route>

              <Route path="/addpost"></Route>

              <Route path="/">
                <Landing />
              </Route>
            </Switch>
          </Suspense>
        </AuthProvider>
      </Router>
      <p className="copyright">&copy; Jakub Gorka 2021</p>
    </div>
  );
}

export default App;

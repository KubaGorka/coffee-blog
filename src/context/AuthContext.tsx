import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { auth } from "../firebaseSetup";

interface IProps {
  children?: React.ReactNode;
}

interface IContext {
  currentUser: firebase.User | null | undefined;
  signUp: (
    user: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  signIn: (
    user: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<IContext>({} as IContext);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: IProps) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();

  // const db = firebase.firestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const signUp = (
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> => {
    return auth.createUserWithEmailAndPassword(email, password);

    // createUser.then((credentials) => {
    //   db.collection("users").doc(credentials.user?.uid).set({
    //     email: email,
    //     userID: credentials.user?.uid,
    //     username: email,
    //   });
    // });
  };

  const signIn = (
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const signOut = (): Promise<any> => {
    return auth.signOut();
  };

  const value: IContext = {
    currentUser,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { useContext, useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";
import { auth } from "../firebaseSetup";

interface IProps {
  children?: React.ReactNode;
}

const AuthContext = React.createContext<any>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: IProps) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();

  const db = firebase.firestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const signUp = (email: string, password: string): Promise<any> => {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        return db.collection('users').doc(credentials.user?.uid).set({
          email: email,
          userID: credentials.user?.uid,
          username: email,
        })
      }).then(() =>{
        console.log('worked');
      }).catch(err =>{
        console.log(err);
      });
  };

  const signIn = (email: string, password: string): Promise<any> => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const signOut = (): Promise<any> => {
    return auth.signOut();
  };

  const value = {
    currentUser,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

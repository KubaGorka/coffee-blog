import React, { useContext, useState, useEffect } from "react";
import app from "../firebaseSetup";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

interface IProps {
  children?: React.ReactNode;
}

interface IContext {
  firebaseDB: firebase.firestore.Firestore | null;
  firebaseStorage: firebase.storage.Storage | null;
}

const FirebaseContext = React.createContext<IContext>({} as IContext);

export function useFirebase() {
  return useContext(FirebaseContext);
}

export const FirebaseProvider = ({ children }: IProps) => {
  const [firebaseDB, setrFirebaseDB] =
    useState<firebase.firestore.Firestore | null>(null);
  const [firebaseStorage, setFirebaseStorage] =
    useState<firebase.storage.Storage | null>(null);

  useEffect(() => {
    setrFirebaseDB(firebase.firestore());
    setFirebaseStorage(firebase.storage());
  }, []);

  const value: IContext = {
    firebaseDB,
    firebaseStorage,
  };
  console.log(value);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

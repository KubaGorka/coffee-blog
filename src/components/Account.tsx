import React from "react";
import { useAuth } from "../context/AuthContext";

const Account = () => {
  const { currentUser, signOut } = useAuth();

  return (
    <div>
      <button onClick={() => signOut()}>SignOut</button>
    </div>
  );
};

export default Account;

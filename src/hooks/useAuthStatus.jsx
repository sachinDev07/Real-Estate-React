import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth } from "../config/firebase";

const useAuthStatus = () => {
    const [loggedIn, setLogggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setLogggedIn(true);
            }
            setCheckingStatus(false);
        })
    },[])
  return {loggedIn, checkingStatus};
}

export default useAuthStatus
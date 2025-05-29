"use client"
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

export default function FB0529() {

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC0wvJb6oCfbkuey96aMHZWOP7jJtgbF7k",
    authDomain: "nccu-113-2-f3e85.firebaseapp.com",
    projectId: "nccu-113-2-f3e85",
    storageBucket: "nccu-113-2-f3e85.firebasestorage.app",
    messagingSenderId: "612693149407",
    appId: "1:612693149407:web:e83a04b3c19af1dc6a0b6a",
    databaseURL:"https://nccu-113-2-f3e85-default-rtdb.firebaseio.com/"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const dbRef = ref(database, "/");
  const auth =getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(()=>{

    const dbRef = ref(database, "/");
    onValue(dbRef,(snapshot)=>{
      console.log(snapshot.val());

    });

    const userRef = ref(database, "/accounts/000001/");
    set(userRef, {
      name: "hazel",
      points: 200
    })

  },[]);

  const addNewAccount =()=>{
  console.log("clicked");
  const accountRef = ref(database, "/accounts");
 

  push(accountRef, {
    name:"hazel",
    type: "User",
    points: "10"
  })
  }
  const login =()=> {
    signInWithPopup(auth,provider).then((result)=>{
      console.log(result);
      console.log(result.user.uid);
      console.log(result.user.displayName);
      
      const uid = result.user.uid;
      const name = result.user.displayName;
      const accountRef = ref(database, "/accounts"+ uid);

      if(accountRef){
        //有此帳號

      }else{
        //沒有此帳號，建立一個
        push(accountRef,{
           name: name,
           type:"User",
           point:"10",
        })

      }

    })

  }

  return (
    <>
      fb0529
      <div onClick={ addNewAccount }className="text-black border-black border-2 px-4 py-1 inline-block">Add New Account</div>
      <div onClick={ login }className="text-black border-black border-2 px-4 py-1 inline-block">Login in with Google</div>
    </>
   
  );
}

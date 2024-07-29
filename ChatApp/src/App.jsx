import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Firestore } from "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCweIuVrjSGSv0X8THaNNKYtyGnZh6S32M",
  authDomain: "chatapp2-ce93e.firebaseapp.com",
  projectId: "chatapp2-ce93e",
  storageBucket: "chatapp2-ce93e.appspot.com",
  messagingSenderId: "173877401424",
  appId: "1:173877401424:web:ab5e3dc2f922afc3ea7e55",
  measurementId: "G-1E3GM6P1K8",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <SignOut />
        </header>
        <section>{user ? <ChatRoom /> : <SignedIn />}</section>
      </div>
    </>
  );
}
function SignedIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    if (formValue === "") {
      return;
    }
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="chatRoom">
        <main>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </main>

        <div ref={dummy}></div>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit"> SEND </button>
        </form>
      </div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        {" "}
        <div>
          <img src={photoURL} />
        </div>
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;

import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

// const config = {
//   apiKey: "AIzaSyCY4oTQMcFHofcjbQn9DqhLBoXt_6hJP14",
//   authDomain: "fir-cd7b4.firebaseapp.com",
//   databaseURL: "https://fir-cd7b4.firebaseio.com",
//   projectId: "fir-cd7b4",
//   storageBucket: "fir-cd7b4.appspot.com",
//   messagingSenderId: "910290729574",
// };

class Firebase {
  constructor() {
    app.initializeApp(config);
    
    this.auth = app.auth();
  }
  
  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
    
  doSignOut = () => this.auth.signOut();
  
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;
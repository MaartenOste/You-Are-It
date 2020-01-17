/**
 * A FireBase Wrapper
 * docs: https://firebase.google.com/docs
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Router from './Router';
import * as consts from '../../consts';

class FireBase {
  constructor(apiKey, projectId, messagingSenderId) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.messagingSenderId = messagingSenderId;
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(this.getFireBaseConfig());
  }

  getFireBaseConfig() {
    return {
      apiKey: `${this.apiKey}`,
      authDomain: `${this.projectId}.firebaseapp.com`,
      databaseURL: `https://${this.projectId}.firebaseio.com`,
      projectId: `${this.projectId}`,
      storageBucket: `${this.projectId}.appspot.com`,
      messagingSenderId: `${this.messagingSenderId}`,
    };
  }

  getFirestore() {
    return firebase.firestore();
  }

  getAuth() {
    return firebase.auth();
  }

  getGoogle() {
    return new firebase.auth.GoogleAuthProvider();
  }

  addUser(name, location, lobbycode, uid) {
    this.getFirestore().collection('players').doc(uid).set({
      lobbycode,
      location,
      name,
      games: 0,
      wins: 0,
      timeplayed: 0,
    });
  }

  setStat(uid, data) {
    this.getFirestore().collection('players').doc(uid).set(data, { merge: true });
  }

  deleteOnUID(uid) {
    this.getFirestore().collection('players').doc(uid).delete();
  }

  checkUser() {
    if (this.getAuth().currentUser == null) {
      const router = new Router(window.location.origin, consts.ROUTER_HASH);
      router.navigate('/login');
    }
  }

  checkConnection() {
    const connection = window.navigator.onLine;
    if (connection === false) {
      const router = new Router(window.location.origin, consts.ROUTER_HASH);
      router.navigate('/offline');
    }
  }

  reCheckConnection() {
    const connection = window.navigator.onLine;
    if (connection === true) {
      window.history.back();
    }
  }
}

export default FireBase;

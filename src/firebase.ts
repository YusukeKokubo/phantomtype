import firebase from 'firebase/app'

const config = {
  apiKey: 'AIzaSyA8wsdQlLLAjZepeaQfeM_l0pfBEaCOyEk',
  authDomain: 'phantomtype.firebaseapp.com',
  databaseURL: 'https://phantomtype.firebaseio.com',
  projectId: 'phantomtype',
  storageBucket: 'phantomtype.appspot.com',
  messagingSenderId: '787190095643',
  appId: '1:787190095643:web:2ea9b8a2fb64946b27bdbe',
  measurementId: 'G-TGRBP7DHKD',
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase

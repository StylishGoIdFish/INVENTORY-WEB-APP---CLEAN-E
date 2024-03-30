// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getFirestore, collection, getDocs,onSnapshot,
    addDoc, deleteDoc, doc,getDoc,
    query, where, updateDoc, 
  } from "firebase/firestore"

import {
  getAuth, createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword, onAuthStateChanged
} from "firebase/auth"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxXRT5q-Q5nl0K72mwSfi8RdXlmrwIAqg",
  authDomain: "clean-e-inventory-management.firebaseapp.com",
  projectId: "clean-e-inventory-management",
  storageBucket: "clean-e-inventory-management.appspot.com",
  messagingSenderId: "345223429975",
  appId: "1:345223429975:web:8342da8ffffa22814f8812",
  measurementId: "G-WPW6S9VSEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



const DATABASE = getFirestore()
const auth = getAuth()
const COLLECTIONREF = collection(DATABASE, 'parts-and-bits')

// Returns Everything in Console (BE SURE TO REMOVE IT ONCE ONLINE)
onSnapshot(COLLECTIONREF, (snapshot)=>{
  let itemDocuments  = []
  snapshot.docs.forEach((doc) => {
    itemDocuments.push({...doc.data(),id:doc.id})
  })
  console.log(itemDocuments)
})







// THIS IS WHERE MOST OF THE FUNCTIONALITY, IE: RECORDING, DELETING, TRACKING, AND UPDATING IS 


// add a new column for UL certificate number
const addItemForm = document.querySelector(".addForm")
if (addItemForm){
  addItemForm.addEventListener('submit', (e) => {
      e.preventDefault()
      addDoc(COLLECTIONREF, {
          itemType: addItemForm.itemType.value,
          quantity: addItemForm.quantity.value,
          warehouseLocation: addItemForm.location.value,
          description: addItemForm.desc.value,
          vendor: addItemForm.vendor.value,
          partNO: addItemForm.partNum.value,
          time: new Date().toString(),
          chainOfCustody: addItemForm.personUpdate.value
      })
      .then(()=>{
          addItemForm.reset()
      })
  })
}
// delete item via ID
const deleteItemForm = document.querySelector('.deleteFormIDVER')
if (deleteItemForm){
  deleteItemForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let docRef = doc(DATABASE, 'parts-and-bits', deleteItemForm.id.value)
    deleteDoc(docRef)
      .then(() => {
        deleteItemForm.reset()
      })
  })
}

// delete documents via TYPE
const deleteItemsForm = document.querySelector(".deleteFormTYPEVER")
if (deleteItemsForm){
  deleteItemsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let queryRef = query(COLLECTIONREF, where('itemType', '==', deleteItemsForm.itemType.value))
    getDocs(queryRef).then((snapshot) => {
      snapshot.docs.forEach((doc1)=>{
        console.log("DELETING",doc1.data(), doc1.id)
        let documentRef = doc(DATABASE, 'parts-and-bits', doc1.id)
        deleteDoc(documentRef)
      })
    })  

  })
}



// updateItem via ID
const updateItemForm = document.querySelector('.updateFormIDVER')
if (updateItemForm){
  updateItemForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let docRef = doc(DATABASE, 'parts-and-bits', updateItemForm.id.value)
    
    // let currentDocData;
    // getDoc(docRef).then((doc1) => {
    //   currentDocData = doc1.data()
    // })

    // console.log(currentDocData)
    


    updateDoc(docRef, {
      itemType: updateItemForm.itemType.value,
      quantity: updateItemForm.quantity.value,
      vendor: updateItemForm.vendor.value,
      time: new Date().toString(),
      warehouseLocation: updateItemForm.location.value,
      partNO: updateItemForm.partNum.value,
      chainOfCustody: updateItemsForm.personUpdate.value,
      description: updateItemForm.desc.value
    })
    .then(() => {
      updateItemForm.reset()
    })
  })
}


//CODE IN SOME THING TO KEEP TRACK OF PREVIOUS DATES
//CODE IN AN EASY WAY TO KEEP SOME FIELDS THE SAME AND SAME FIELDS DIFFERENT (REMEMBER TO PUT 14 AWG Green for insulated in description later)
const updateItemsForm = document.querySelector('.updateFormTYPEVER')
if(updateItemsForm){
  updateItemsForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    let queryRef = query(COLLECTIONREF, where('itemType', '==', updateItemsForm.itemType.value))
    getDocs(queryRef).then((snapshot) => {
      snapshot.docs.forEach((doc1)=>{
        console.log("UPDATING", doc1.data(), doc1.id)
        let documentRef = doc(DATABASE, 'parts-and-bits', doc1.id)
        updateDoc(documentRef, {
          itemType: updateItemsForm.itemTypeUpdate.value,
          quantity: updateItemsForm.quantity.value,
          vendor: updateItemsForm.vendor.value,
          time: new Date().toString(),
          chainOfCustody: updateItemsForm.personUpdate.value
        })  
      })
    })
  })
}







// AUTHENTICATION, REGISTERING NEW USERS AND LOGGING IN AND OUT, AND DELETING USERS. 



//Create new user
const signupForm = document.querySelector(".signUp")
if (signupForm){
  signupForm.addEventListener("submit", (e)=>{
    console.log("Authenting")
    e.preventDefault()
    const email = signupForm.email.value
    const password = signupForm.password.value
    createUserWithEmailAndPassword(auth, email, password)
    .then((cred)=>
    {
      console.log('User Created: ', cred.user)
      signupForm.reset()
    })
    .catch((err)=>{
      console.log(err.message)
    })
  })
}


//log out
const logoutButton = document.querySelector(".logout")
if (logoutButton){
  logoutButton.addEventListener('click', () =>{
    signOut(auth).then(()=>{
      console.log("User Signed Out")
      location.replace("login.html")
    }).catch((err)=>{
      console.log(err.message)
    })
  })
}

//log in
const loginForm = document.querySelector('.login')
if (loginForm){
  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth, email, password).then((cred)=>{
      console.log("User logged in!: "+ cred.user)
      location.replace("home.html")

    }).catch((err)=>{
      console.log("There was an error logging in: " + err.message)
    })

  })
}




const trackingFormType = document.querySelector(".trackType")
if (trackingFormType){
  trackingFormType.addEventListener('submit', (e)=>{
    e.preventDefault()
    const itemType = document.getElementById('itemType').value;
    const q = query(COLLECTIONREF, where ('itemType', '==', itemType));
    getDocs(q).then((snapshot)=>{
      document.getElementById('output').innerHTML = ''
      const table = document.createElement('table');
      table.classList.add('results-table');

      const headerRow = table.insertRow();
      headerRow.innerHTML = '<th>Document ID</th><th>Item Type</th><th>Manufacturer</th><th>Quantity</th><th>Time</th><th>Part NO:</th><th>Item Desc.</th><th>Location</th>'; // Add more headers as needed

      snapshot.forEach((doc) => {
        const data = doc.data();
        const row = table.insertRow();
        row.innerHTML = `<td>${doc.id}</td><td>${data.itemType}</td><td>${data.vendor}</td><td>${data.quantity}</td><td>${data.time}</td><td>${data.partNO}</td><td>${data.description}</td><td>${data.warehouseLocation}</td>`; // Add more cells as needed
      });

      document.getElementById('output').appendChild(table)

    })
  })
}

// const trackingFormDate = document.querySelector(".trackDate");

// if (trackingFormDate) {
//   trackingFormDate.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const itemType = document.getElementById('itemType').value;
//     const startDate = document.getElementById('startDate').value;
//     const endDate = document.getElementById('endDate').value;

//     const q = query(COLLECTIONREF, 
//                     where('time', '>=', startDate),
//                     where('time', '<=', endDate));

//     getDocs(q).then((snapshot) => {
//       document.getElementById('output').innerHTML = '';
//       const table = document.createElement('table');
//       table.classList.add('results-table');

//       const headerRow = table.insertRow();
//       headerRow.innerHTML = '<th>Document ID</th><th>Item Type</th><th>Vendor</th><th>Quantity</th><th>Time</th>'; // Add more headers as needed

//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         const row = table.insertRow();
//         row.innerHTML = `<td>${doc.id}</td><td>${data.itemType}</td><td>${data.vendor}</td><td>${data.quantity}</td><td>${data.time}</td>`; // Add more cells as needed
//       });

//       document.getElementById('output').appendChild(table);
//     });
//   });
// }



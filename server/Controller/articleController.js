const Articles = require("./../models/article")
const { initializeApp } =require("firebase/app");
const firebaseConfig =require("./../firebaseConfig.js");
// import { getStorage, ref,getDownloadURL, uploadBytes } from "firebase/storage";

const { getStorage, ref, uploadBytes } = require("firebase/storage")




const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

exports.addPhototest = async (req,res) =>{
    function getCurrentDateTimeString() {
        const now = new Date();
      
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
      
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
      
        const dateString = `${year}-${month}-${day}`;
        const timeString = `${hours}:${minutes}:${seconds}`;
      
        // Combine date and time
        const dateTimeString = `${dateString} ${timeString}`;
      
        return dateTimeString;
      }

    // Get a reference to the storage location
    const storageRef = ref(storage, 'image'+getCurrentDateTimeString());
    
    // Upload the image
    const file = req.body;
    console.log(file)
    // uploadBytes(storageRef, file)
    //   .then((snapshot) => {
    //     console.log('Uploaded a blob or file!', snapshot);
    //   })
    //   .catch((error) => {
    //     console.error('Error uploading image:', error);
    //   });
}


exports.addArticles = async (req,res) =>{

  


}


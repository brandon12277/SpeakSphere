from flask import Flask, jsonify,request
import numpy as np 
from flask_cors import CORS
import joblib
from urllib import request as req
import sklearn
from PIL import Image
from io import BytesIO
import tensorflow as tf
from tensorflow.keras.models import load_model # type: ignore
from tensorflow.keras.preprocessing import image # type: ignore



import base64
import os
import random

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)



os.makedirs("uploads", exist_ok=True)
model_path  = 'imageFiltermodel'

cnn = tf.saved_model.load(model_path)
infer =cnn.signatures["serving_default"]

class UniqueUIDGenerator:
    def __init__(self):
        self.generated_uids = set()

    def generate_uid(self):
        while True:
            uid = ''.join(random.choice('0123456789') for _ in range(6))
            if uid not in self.generated_uids:
                self.generated_uids.add(uid)
                return uid


generator = UniqueUIDGenerator()


print("IN")
@app.route('/image_filter',methods=['POST'])
def filter():
        
         file = request.files['image']
         if file.filename == '':
          return 'No selected file', 400

         uid = generator.generate_uid()
         url  = 'uploads/'+uid+'.png'
         with open(url, 'wb') as img:
            file.save(url)

         img = image.load_img(url, target_size=(64,64))
  
         img_array = image.img_to_array(img)
   

         


       
            

       
           
     
         resized_img_array = np.expand_dims(img_array, axis=0)
             
        
         input_tensor = tf.convert_to_tensor(resized_img_array)
         result = infer(input_tensor)
         result = result['output_0'].numpy() 

         class_label = -1
         if result[0][0] == 1:
            class_label = 0
         elif result[0][1] == 1:
            class_label = 1
         else:
            class_label = 2
         
         

         os.remove(url)

         res = jsonify({'class': class_label})
         res.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
         res.headers.add('Access-Control-Allow-Headers', 'Content-Type')

         return res



if __name__ == '__main__':
    app.run(debug=True)

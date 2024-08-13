from flask import Flask, jsonify,request
import numpy as np 
from flask_cors import CORS
import joblib
from urllib import request as req
import sklearn
from PIL import Image
from io import BytesIO
import tensorflow 
from keras.models import load_model
from keras.preprocessing import image
from keras.applications.inception_v3 import preprocess_input, decode_predictions
import base64
import os
import random

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)


os.makedirs("uploads", exist_ok=True)

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

cnn = load_model('image_filter_2.h5')
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
    # Convert the image to a NumPy array
         img_array = image.img_to_array(img)
    # Expand dimensions to match the input shape of the model (batch size, height, width, channels)
       
      #   image_url = request.json
      #   image_url = image_url.get('image')
       
      #   if image_url != "":




       
            

       
           
     
         resized_img_array = np.expand_dims(img_array, axis=0)
             
         print("Start prediction")
         result = cnn.predict(resized_img_array)
         print("End prediction")

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
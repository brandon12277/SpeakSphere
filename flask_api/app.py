from flask import Flask, jsonify,request
import numpy as np 
from flask_cors import CORS
import joblib
from urllib import request as req
import sklearn
from PIL import Image
from io import BytesIO
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input, decode_predictions
import base64
import os

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)


cnn = load_model('image_filter_2.h5')

@app.route('/image_filter',methods=['POST'])
def filter():
    if request.method == 'OPTIONS':
        response = make_response()
    else:
        image_url = request.json
        image_url = image_url.get('image')
       
        if image_url != "":




       
            

       
            print("IN")
            image_bytes = base64.b64decode(image_url.split(",")[1])

            image_pil = Image.open(BytesIO(image_bytes))

            # Resize the image to (64, 64)
            #image_pil_resized = image_pil.resize((64, 64))
            image_pil_resized = image.load_img(BytesIO(image_bytes), target_size = (64, 64))
            # Convert the resized PIL Image to a NumPy array
            image_np_resized = image.img_to_array(image_pil_resized)
            print("IN")
            # Expand the dimensions to match the input shape of your model
            resized_img_array = np.expand_dims(image_np_resized, axis=0)

            # Preproces s the resized input image
            print("IN")
            result = cnn.predict(resized_img_array)
            print("OUT")
            class_label = -1

            if result[0][0] == 1:
               class_label = 0

            elif result[0][1] == 1:
               class_label = 1
            else:
               class_label = 2
            response = jsonify({'class': class_label})
        else:
            response = jsonify({'class': 1})

    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3001')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response



if __name__ == '__main__':
    app.run(debug=True)

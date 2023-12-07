from flask import Flask, jsonify,request
import numpy as np 
from flask_cors import CORS
import joblib
import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from urllib import request as req
import sklearn
from PIL import Image
from io import BytesIO
from keras.models import load_model
from keras.preprocessing import image
from keras.applications.inception_v3 import preprocess_input, decode_predictions
import base64

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

all_stopwords = stopwords.words('english')
cnn = load_model('image_filter_2.h5')
model_tree = joblib.load('text_filter_svc.h5')

@app.route('/image_filter',methods=['POST'])
def filter():
    if request.method == 'OPTIONS':
        response = make_response()
    else:
        image_url = request.json
        image_url = image_url.get('image')
       
        if image_url != "":




       
            

       
            
            image_bytes = base64.b64decode(image_url.split(",")[1])

            image_pil = Image.open(BytesIO(image_bytes))

            # Resize the image to (64, 64)
            #image_pil_resized = image_pil.resize((64, 64))
            image_pil_resized = image.load_img(BytesIO(image_bytes), target_size = (64, 64))
            # Convert the resized PIL Image to a NumPy array
            image_np_resized = image.img_to_array(image_pil_resized)

            # Expand the dimensions to match the input shape of your model
            resized_img_array = np.expand_dims(image_np_resized, axis=0)

            # Preprocess the resized input image
    
            result = cnn.predict(resized_img_array)
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


@app.route('/simple', methods=['POST'])
def simple():
    if request.method == 'OPTIONS':
        response = make_response()
    else:
        # Your route logic here
        text = request.json
        text = text.get('description')
        text_data= []
        
        vectorizer_text = joblib.load('vectorizer.joblib')
        text_array = text.split('.')    
        length = len(text_array)
        for text in text_array:
    
          text = re.sub('[^a-zA-Z]', ' ', text)
          text = text.lower()
          text = text.split()
          ps = PorterStemmer()
          text = [ps.stem(word) for word in text if not word in set(all_stopwords)]
          text = ' '.join(text)
          text_data.append(text)
        




        text_pro = vectorizer_text.transform(text_data).toarray()
        lines = []
        for i in range(0, len(text_pro)):
            y_p = model_tree.predict([text_pro[i]])
            
            if y_p[0] == 1 or y_p[0] == 0:
                lines.append(i)
        response = jsonify({'message': lines})

    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3001')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response
   

if __name__ == '__main__':
    app.run(debug=True)

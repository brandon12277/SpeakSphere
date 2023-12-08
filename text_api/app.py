from flask import Flask, jsonify,request
import numpy as np 
from flask_cors import CORS
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import sklearn

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)
all_stopwords = ""
with open("english_stopwords.txt", 'r') as file:
    all_stopwords = set(file.read().splitlines())

model_tree = joblib.load('text_filter_svc.h5')
vectorizer_text = joblib.load('vectorizer.joblib')

@app.route('/simple', methods=['POST'])
def simple():
    if request.method == 'OPTIONS':
        response = make_response()
    else:
        # Your route logic here
        text = request.json
        text = text.get('description')
        text_data= []
        
        
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

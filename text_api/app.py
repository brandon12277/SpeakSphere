from flask import Flask, jsonify,request,make_response
import numpy as np 
from flask_cors import CORS
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import sklearn
from flask_apscheduler import APScheduler
import requests

app = Flask(__name__)
CORS(app)
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

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response
   
@app.route("/getpost",methods=["GET"])
def get_post():
    # Respond with an empty JSON object
    return jsonify({}), 200

def make_request():
    try:
        response = requests.get("https://speak-flask-text-api.onrender.com/getpost")
        if response.status_code == 200:
            print("Up and running")
        else:
            print("Unexpected status code:", response.status_code)
    except requests.exceptions.RequestException as e:
        print("Oops! Server down", e)   

if __name__ == '__main__':
    scheduler = APScheduler()
    scheduler.add_job(id='Scheduled Task', func=make_request, trigger='interval', minutes=10)
    scheduler.start()
    app.run(debug=True)

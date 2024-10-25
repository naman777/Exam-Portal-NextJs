import mediapipe as mp
import cv2
from flask import Flask, jsonify, request
import numpy as np
from PIL import Image
from flask_cors import CORS
from facenet_pytorch import InceptionResnetV1,MTCNN
from io import BytesIO

app = Flask(__name__)
CORS(app)

mp_face_detect = mp.solutions.face_detection
mp_hands = mp.solutions.hands

face_detect = mp_face_detect.FaceDetection(model_selection=1, min_detection_confidence=0.9)
hand_detect = mp_hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.8)

@app.route('/detect_face', methods=['POST'])
def detect_faces():
    if 'image' not in request.files:
        return jsonify({'result': False, 'message': "Image not given!"})
    
    image_file = request.files['image']
    file_bytes = np.frombuffer(image_file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'result': False, 'message': "Image processing failed!"})

    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    face_results = face_detect.process(rgb_img)
    
    hand_results = hand_detect.process(rgb_img)

    if face_results.detections and len(face_results.detections) == 1 and not hand_results.multi_hand_landmarks:
        return jsonify({'result': True})
    else:
        if hand_results.multi_hand_landmarks:
            return jsonify({'result': False, 'message': "Hand detected on face, please remove it."})
        else:
            return jsonify({'result': False, 'message': "Face not detected or obstructed!"})




mtcnn = MTCNN(keep_all=False)
model = InceptionResnetV1(pretrained="vggface2").eval()

def extract_embeddings(image_data):
    img = Image.open(BytesIO(image_data))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img_np = np.array(img)

    face = mtcnn(img_np)
    if face is None:
        return None
    
    embeddings = model(face.unsqueeze(0))
    return embeddings.detach().numpy()

@app.route('/match', methods=['POST'])  
def match_faces():
    if 'image1' not in request.files or 'image2' not in request.files:
        return jsonify({'result' : False, 'message': 'Images not received'})
    
    image1 = request.files['image1'].read()
    image2 = request.files['image2'].read()

    try:
        embeddings1 = extract_embeddings(image1)
        embeddings2 = extract_embeddings(image2)
    except:
        return jsonify({'result' : False, 'message': 'Images not received'})

    if embeddings1 is None or embeddings2 is None:
        return jsonify({'result' : False, 'message': 'No face detected'})
    
    distance = np.linalg.norm(embeddings1 - embeddings2)
    threshold = 1.0 

    match = bool(distance < threshold)
    return jsonify({'result': match})


if __name__ == '__main__':
    app.run()
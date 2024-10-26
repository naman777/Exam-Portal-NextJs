import mediapipe as mp
import cv2
from flask import Flask, jsonify, request
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe Face Detection and Hand Detection
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
    
    # Process the image for face and hand detection
    face_results = face_detect.process(rgb_img)
    hand_results = hand_detect.process(rgb_img)

    if face_results.detections and len(face_results.detections) == 1 and not hand_results.multi_hand_landmarks:
        return jsonify({'result': True})
    else:
        if hand_results.multi_hand_landmarks:
            return jsonify({'result': False, 'message': "Hand detected on face, please remove it."})
        else:
            return jsonify({'result': False, 'message': "Face not detected or obstructed!"})

# Vercel entry point
def handler(request):
    with app.app_context():
        return app.full_dispatch_request()

if __name__ == "__main__":
    app.run()

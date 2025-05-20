import io
import cv2
import torch
import numpy as np
import pytesseract
from flask import Flask, render_template, request, redirect, url_for

import sys
from flask import Flask, request, jsonify
import io
import numpy as np
import cv2


# Add local YOLOv7 path to Python
sys.path.append('/content/drive/MyDrive/yolo_training/yolov7')

model_path = r'/home/ashim99/major/ML_model/best.pt'
device = 'cuda' if torch.cuda.is_available() else 'cpu'

# Load the state dictionary
        # run_id = torch.load(weights, map_location=device,weights_only=False).get('wandb_id') if weights.endswith('.pt') and os.path.isfile(weights) else None

ckpt = torch.load(model_path, map_location=device,weights_only=False)

# Access the model from the loaded checkpoint
# YOLOv7 checkpoints often contain 'ema' or 'model' keys
model = ckpt['ema' if ckpt.get('ema') else 'model'].float()

# Move model to device and set to evaluation mode
model.to(device).eval()

app = Flask(__name__)


import torch
import cv2
import numpy as np

def run_yolo(image: np.ndarray):
    """Preprocess image and run YOLOv7 inference."""
    # Resize to expected size (typically 640x640 for YOLOv7)
    img_resized = cv2.resize(image, (640, 640))

    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)

    # Convert to float32 and normalize to [0, 1]
    img_rgb = img_rgb.astype(np.float32) / 255.0

    # Transpose to [C, H, W]
    img_transposed = np.transpose(img_rgb, (2, 0, 1))

    # Convert to PyTorch tensor and add batch dimension [1, C, H, W]
    img_tensor = torch.from_numpy(img_transposed).unsqueeze(0).to(device)

    # Inference
    with torch.no_grad():
        results = model(img_tensor)

    # Extract detections from results (YOLOv7 returns output as a list of tensors)
    detections = results[0].cpu().numpy()  # shape: [N, 6] → [x1, y1, x2, y2, conf, cls]

    return detections


def ocr_on_crops(image: np.ndarray, detections):
    """ Crop detections and run Tesseract OCR. """
    ocr_results = {}
    for i, det in enumerate(detections):
        x1, y1, x2, y2, conf, cls = det.astype(int)
        # Crop with padding/clamping
        h, w = image.shape[:2]
        pad = 5
        x1, y1 = max(0, x1 - pad), max(0, y1 - pad)
        x2, y2 = min(w, x2 + pad), min(h, y2 + pad)
        crop = image[y1:y2, x1:x2]

        # Convert crop to grayscale + thresholding (optional)
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        # _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU + cv2.THRESH_BINARY)
        # Run OCR
        text = pytesseract.image_to_string(gray, lang='eng')
        ocr_results[i+1] = text.strip()
    return ocr_results


app = Flask(__name__)

@app.route('/', methods=['POST'])
def upload_and_process():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Read image into OpenCV format
    in_memory = io.BytesIO()
    file.save(in_memory)
    data = np.frombuffer(in_memory.getvalue(), dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)

    # 1. Run YOLO
    detections = run_yolo(img)

    # 2. Crop + OCR
    ocr_results = ocr_on_crops(img, detections)
    # ocr_results={"name":"ashim"}
    # 3. Return OCR results as JSON
    return jsonify(ocr_results)


    # return #jsonresponse data {name:adhim thau:kalapani}


if __name__ == '__main__':

    # # Port your Flask app runs on (usually 5000)
    # port = 5000

    # # Start a tunnel (http://localhost:5000 -> public URL)
    # public_url = ngrok.connect(port)

    # print(" * ngrok tunnel running at:", public_url)
    app.run()

import io
import cv2
import torch
import numpy as np
import pytesseract
from flask import Flask, render_template, request, redirect, url_for
import sys

# Add local YOLOv7 path to Python
sys.path.append('/content/drive/MyDrive/yolo_training/yolov7')

model_path = './best.pt'
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


def run_yolo(image: np.ndarray):
    """ Run YOLO inference and return results. """
    # YOLOv7 expects images in BGR; convert to RGB
    img_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = model(img_rgb)  # inference
    detections = results.xyxy[0].cpu().numpy()  # [x1, y1, x2, y2, conf, class]
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

@app.route('/', methods=['GET', 'POST'])
def upload_and_process():
    ocr_results = {}
    if request.method == 'POST':
        file = request.files.get('image')
        if not file:
            return redirect(request.url)
        # Read image into OpenCV format
        in_memory = io.BytesIO()
        file.save(in_memory)
        data = np.frombuffer(in_memory.getvalue(), dtype=np.uint8)
        img = cv2.imdecode(data, cv2.IMREAD_COLOR)

        # 2. Run YOLO
        detections = run_yolo(img)

        # 3. Crop + OCR
        ocr_results = ocr_on_crops(img, detections)

    return render_template('upload.html', ocr_results=ocr_results)
if __name__ == '__main__':
    app.run()

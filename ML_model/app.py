import torch
from PIL import Image
import cv2

model = torch.hub.load('ultralytics/yolov5', 'custom', path='best.pt')
img = cv2.imread("front.jpg")
results = model(img)
results.print()
results.show()

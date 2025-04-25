from flask import Flask, request, jsonify, send_file
from PIL import Image
import io, os
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from flask_cors import CORS
import numpy as np
from dip_code import get_model_net, torch_to_np

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROCESSED_IMAGE_PATH = os.path.join(BASE_DIR, "processed_images")
os.makedirs(PROCESSED_IMAGE_PATH, exist_ok=True)


def get_model_image(image_file, model):
    net = get_model_net()
    device = torch.device("cpu")
    net = net.to(device)
    net.load_state_dict(torch.load(model, map_location=device))

    image = Image.open(image_file).convert("L")  # Convert to grayscale if necessary
    print(f"Original image size: {image.size}")
    
    width, height = image.size

    # Define the transformation
    transform = transforms.Compose([
        transforms.Resize((height, width)),  # Resize the image ((1184, 896))
        transforms.ToTensor()            # Convert the image to a tensor for the given model
    ])

    # Apply the transformation
    test_new_tensor = transform(image)
    test_new_tensor = test_new_tensor.to(device)
    # Since the required shape is [1, 32, 1184, 896], repeat the image across a new dimension and adjust the batch dimension
    test_new_tensor = test_new_tensor.unsqueeze(0)  # Add a batch dimension [1, 1, 1184, 896]
    test_new_tensor = test_new_tensor.repeat(1, 32, 1, 1)
    print(test_new_tensor.shape)

    # new_HR_np = torch_to_np(net(test_new_tensor))
    
    # Run through the network
    with torch.no_grad():  # No need to track gradients
        output_tensor = net(test_new_tensor)

    # Convert output tensor to NumPy and save
    output_np = torch_to_np(output_tensor)

    # Clip values to [0,1], transpose if necessary
    output_np = np.clip(output_np, 0, 1)
    if output_np.shape[0] == 3:  # [C,H,W] -> [H,W,C]
        output_np = np.transpose(output_np, (1, 2, 0))

    # Convert to PIL and save
    output_img = Image.fromarray((output_np * 255).astype(np.uint8))
    return output_img

@app.route('/processImage', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'message': 'No image provided'}), 400

    image_file = request.files['image']
    original_filename = os.path.splitext(image_file.filename)[0]
    model_path = os.path.join(BASE_DIR, "hist_dip_modelTHE.pth")

    try:
        out_img = get_model_image(image_file, model_path)

        # 4) Save to a file or memory
        output_filename = f"{original_filename}-output.png"
        image_path = os.path.join(PROCESSED_IMAGE_PATH, output_filename)
        out_img.save(image_path)

        return jsonify({
            'message': 'Image processed and saved successfully',
            'image_path': output_filename
        }), 200

    except Exception as e:
        print("Ex",str(e))
        return jsonify({'message': 'Error processing image', 'error': str(e)}), 500

@app.route('/getProcessedImage', methods=['GET'])
def get_processed_image():
    try:
        image_name = request.args.get('imageName')
        if not image_name:
            return jsonify({'message': 'Image name is required'}), 400

        output_filename = f"{os.path.splitext(image_name)[0]}-output.png"
        image_path = os.path.join(PROCESSED_IMAGE_PATH, output_filename)

        if not os.path.exists(image_path):
            return jsonify({'message': 'No processed image found'}), 404

        return send_file(image_path, mimetype='image/png')
    except Exception as e:
        return jsonify({'message': 'Error fetching image', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

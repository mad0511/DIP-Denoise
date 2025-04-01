from flask import Flask, request, jsonify, send_file
from PIL import Image
import io, os
from flask_cors import CORS
from flask_cors import cross_origin


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Get absolute path for storing processed images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROCESSED_IMAGE_PATH = os.path.join(BASE_DIR, "processed_images")
os.makedirs(PROCESSED_IMAGE_PATH, exist_ok=True)
print("Running flask server...")

@app.route('/processImage', methods=['POST'])
def process_image():
    print("Endpoint /processImage hit")
    
    if 'image' not in request.files:
        return jsonify({'message': 'No image provided'}), 400
    
    image_file = request.files['image']
    original_filename = os.path.splitext(image_file.filename)[0]  # Get filename without extension
    
    try:
        image = Image.open(image_file)
        bw_image = image.convert('L')
        
        # Generate a new filename for the processed image
        output_filename = f"{original_filename}-output.png"
        image_path = os.path.join(PROCESSED_IMAGE_PATH, output_filename)
        bw_image.save(image_path)
        
        return jsonify({'message': 'Image processed and saved successfully', 'image_path': output_filename}), 200
    
    except Exception as e:
        return jsonify({'message': 'Error processing image', 'error': str(e)}), 500

@app.route('/getProcessedImage', methods=['GET'])
def get_processed_image():
    try:
        image_name = request.args.get('imageName')
        print(image_name)
        
        if not image_name:
            return jsonify({'message': 'Image name is required'}), 400
        
        output_filename = f"{os.path.splitext(image_name)[0]}-output.png"
        image_path = os.path.join(PROCESSED_IMAGE_PATH, output_filename)
        
        print(image_path)
        if not os.path.exists(image_path):
            return jsonify({'message': 'No processed image found'}), 404
        
        return send_file(image_path, mimetype='image/png')
    except Exception as e:
        print("ex",str(e))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

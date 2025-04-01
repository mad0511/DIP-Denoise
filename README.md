# Project Name - Image Comparison

## Description - 
### This is a simple project is based on React and Python-Flask for machine learning model integration on backend to enable users to integrate custom models and view the difference between original and ouput image by sliding curtain way.

# Landing Page - 
<img width="670" alt="Screenshot 2025-04-01 at 12 35 17 PM" src="https://github.com/user-attachments/assets/cb831fcb-c5d6-43c5-909f-e62f4194db80" />

# Output Page - 
<img width="1023" alt="Screenshot 2025-04-01 at 12 35 43 PM" src="https://github.com/user-attachments/assets/3c8ac734-da14-4395-b668-13ce44b77171" />

## Python Integration part - 

```
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
```

### Replace the function to your own function - make sure to keep the processed file in the same format or you can modify get_processed_image() function.

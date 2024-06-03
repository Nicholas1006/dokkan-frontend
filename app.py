import os
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)
FILES_DIR = 'backend/'

@app.route('/<path:suburl>', methods=['GET'])
def handle_request(suburl):
    json_file = os.path.join(FILES_DIR,'jsonsCompressed/', f'{suburl}.json')
    final_asset_image = os.path.join(FILES_DIR,'assets/final_assets/', f'{suburl}.png')

    if not os.path.isfile(json_file) or not os.path.isfile(final_asset_image):
        return jsonify({"error": "File not found"}), 404

    with open(json_file, 'r') as f:
        json_data = f.read()

    return jsonify({"json_data": json_data, "image_url": f'/image/{suburl}.png'})

@app.route('/image/<path:filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory(FILES_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True)

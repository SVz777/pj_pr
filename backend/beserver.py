import flask
from flask import request, jsonify
from werkzeug.datastructures import FileStorage
from PIL import Image
from car_plate_recognition import get_plate_from_model

app = flask.Flask("pr")


# def get_plate_from_model(img):
#     return ""


@app.route('/getplate', methods=['POST'], strict_slashes=False)
def get_plate():
    try:
        f: FileStorage = request.files['file']  # 从表单的file字段获取文件，file为该表单的name值
        img = Image.open(f.stream)
        plate = get_plate_from_model(img)
        return jsonify({"errno": 0, "errmsg": "ok", "plate": plate})
    except:
        return jsonify({"errno": -1, "errmsg": "error", "plate": ""})


app.run("", 8002)

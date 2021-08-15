from app.auth import bp
from flask import request, jsonify
from app.auth import services
from app.utils.json_format import json_format
import json


@bp.route('/login', methods=['GET', 'POST'])
def login():
    data = json.loads(request.data)
    user = services.login(data)
    if user:
        return jsonify({'status': '200', 'user': json_format(user)})
    else:
        return jsonify({'status': '500', 'msg': '登录失败'})

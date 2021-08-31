from app.auth import bp
from flask import request, jsonify, session
from app.auth import services
from app.utils.json_format import json_format
import json
from flask_login import login_user, logout_user, login_required, current_user


@bp.route('/login', methods=['GET', 'POST'])
def login():
    data = json.loads(request.data)
    user = services.login(data)
    if user:
        session.permanent = True
        login_user(user)
        cure = current_user
        print(cure)
        return jsonify({'status': '200', 'user': json_format(user)})
    else:
        return jsonify({'status': '500', 'msg': '登录失败'})






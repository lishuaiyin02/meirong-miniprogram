from app.user import bp
from flask import request, jsonify
from app.user import services
from app.utils.json_format import json_format
import json


@bp.route('/getNicknames')
def getNicknames():
    nicknames = services.getNicknames()
    print(nicknames)
    nickname = [name[0] for name in nicknames]
    print(nickname)
    if nicknames:
        return jsonify({'status': '200', 'msg': '查询成功', 'nicknames': nickname})
    else:
        return jsonify({'status': '500', 'msg': '查询失败'})


@bp.route('/register', methods=["GET", "POST"])
def register():
    data = json.loads(request.data)
    user = services.register(data)
    if user:
        return jsonify({'status': '200', 'msg': "注册成功", 'user': json_format(user)})
    else:
        return jsonify({'status': '500', 'msg': "注册失败"})


@bp.route('/saveEdit', methods=["GET", "POST"])
def saveEdit():

    pass
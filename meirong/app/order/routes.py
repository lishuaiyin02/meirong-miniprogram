from app.order import bp
from flask import request, jsonify
from app.order import services
from app.utils.json_format import json_format
import json
from flask_login import login_required

@bp.route('/order', methods=['GET', 'POST'])
def order():
    data = json.loads(request.data)
    order = services.save_order(data)
    if order:
        return jsonify({'status': '200', 'msg': '预约成功', 'order': json_format(order)})
    else:
        return jsonify({'status': '500', 'msg': '预约失败'})
    print(data)
    # user = services.login(data)
    # if user:
    #     return jsonify({'status': '200', 'user': json_format(user)})
    # else:
    #     return jsonify({'status': '500', 'msg': '登录失败'})
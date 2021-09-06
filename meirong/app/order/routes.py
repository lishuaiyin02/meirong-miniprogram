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
        return jsonify({'status': '200', 'msg': '预购成功', 'order': json_format(order)})
    else:
        return jsonify({'status': '500', 'msg': '预购失败'})


@bp.route('/getOclassification')
def getOclassification():
    oclassification = services.getOclassification()
    if oclassification:
        jsonoclassification = json_format(oclassification)

        for index, ac in enumerate(oclassification):
            jsonoclassification[index]['contents'] = []
            jsonoclassification[index]['prices'] = []
            for content in ac.contents:
                jsonoclassification[index]['contents'].append(content.content)
                jsonoclassification[index]['prices'].append(content.prices)
        print('2323', oclassification[0].contents[0].content)
        return jsonify({'status': '200', 'msg': '预约成功', 'appointment': jsonoclassification})
    else:
        return jsonify({'status': '500', 'msg': '预约失败'})


@bp.route('/getOrders')
def getOrders():
    user_id = request.values.get("user_id")
    orders = services.getOrders(user_id)
    if orders == "False":
        return jsonify({'status': '500', 'msg': '获取订单失败'})
    else:
        return jsonify({'status': '200', 'orders': json_format(orders)})

    cancelOrder

@bp.route('/cancelOrder')
def cancelOrder():
    order_id = request.values.get('order_id')
    cancel = services.cancelOrder(order_id)
    if cancel:
        return jsonify({'status': '200', 'msg': '取消成功'})
    else:
        return jsonify({'status': '500', 'msg': '取消失败'})
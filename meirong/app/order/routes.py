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
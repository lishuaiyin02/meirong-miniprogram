from app.appointment import bp
from flask import request, jsonify
from app.appointment import services
from app.utils.json_format import json_format
import json
from flask_login import login_required

@bp.route('/appointment', methods=['GET', 'POST'])
def appointment():
    data = json.loads(request.data)
    appointment = services.save_appointment(data)
    if appointment:
        return jsonify({'status': '200', 'msg': '预约成功', 'appointment': json_format(appointment)})
    else:
        return jsonify({'status': '500', 'msg': '预约失败'})


@bp.route('/getAclassification')
def getAclassification():
    aclassification = services.getAclassification()
    if aclassification:
        jsonaclassification = json_format(aclassification)

        for index, ac in enumerate(aclassification):
            jsonaclassification[index]['contents'] = []
            for content in ac.contents:
                jsonaclassification[index]['contents'].append(content.content)
        print('2323', aclassification[0].contents[0].content)
        return jsonify({'status': '200', 'msg': '预约成功', 'appointment': jsonaclassification})
    else:
        return jsonify({'status': '500', 'msg': '预约失败'})

from app.question import bp
from flask import request, jsonify
from app.question import services
from app.utils.json_format import json_format
import json


@bp.route('/getQuestions')
def getQuestions():
    questions = services.getQuestions()
    if questions == "False":
        return jsonify({'status': '500', 'msg': '获取问题失败'})
    else:
        return jsonify({'status': '200', 'questions': json_format(questions)})
    pass
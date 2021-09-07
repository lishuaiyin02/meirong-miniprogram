from app.user import bp
from flask import request, jsonify, current_app
from app.user import services
from app.utils.json_format import json_format
import json, os, random
from app import uploaded_photos

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
    print('注册')
    data = json.loads(request.data)
    user = services.register(data)
    if user:
        return jsonify({'status': '200', 'msg': "保存成功", 'user': json_format(user)})
    else:
        return jsonify({'status': '500', 'msg': "注册失败"})


# 保存每个用户的头像
@bp.route('/saveImage/<user_nickname>', methods=["GET", "POST"])
def saveImage(user_nickname):
    request1 = request.values.get('user33')
    save_path = current_app.config['UPLOADED_PHOTOS_DEST']
    filenames = os.listdir(save_path)
    for filename in filenames:
        temp = filename.split('--')
        if len(temp) < 2:
            continue
        if temp[1] == user_nickname + '.png':
            os.remove(save_path + '/' + filename)
            print("删除重复文件")
            break
    photo = request.files['photo']
    if photo.filename == "":
        print("没有选择文件")
        return jsonify({'status': '500', 'msg': "没有图片上传"})
    else:
        try:
            photo.filename = services.generate_verification_code(6) + '--' + user_nickname + '.png'
            uploaded_photos.save(photo)
            url = uploaded_photos.url(photo.filename)
            print("url", url)
            return jsonify({'status': '200', 'url': url})
        except Exception as e:
            print('upload file exception: %s' % e)
            return jsonify({'status': '500', 'msg': "图片上传失败"})

    print(filenames)

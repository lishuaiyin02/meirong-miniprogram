import os
from dotenv import load_dotenv
import datetime
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'IuK2-ii0N-B8yh-VVty'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'app.db')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_POOL_RECYCLE = 200
    TEMPLATES_AUTO_RELOAD = True
    BABEL_DEFAULT_LOCALE = 'zh'
    BABEL_DEFAULT_TIMEZONE = 'Asia/Shanghai'

    PERMANENT_SESSION_LIFETIME = datetime.timedelta(seconds=30 * 60)
    SESSION_USE_SIGNER = True

    UPLOADED_PHOTOS_DEST = os.path.join(basedir, 'app/static/image')  # 相对路径下的文件夹images
    UPLOADED_PHOTO_ALLOW = IMAGES  # 限制只能够上传图片
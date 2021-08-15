import os
from dotenv import load_dotenv
import datetime

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

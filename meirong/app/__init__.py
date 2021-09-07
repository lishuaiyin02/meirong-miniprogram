from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_login import LoginManager
from flask_uploads import UploadSet, configure_uploads
import logging
import os
from logging.handlers import RotatingFileHandler

app_root = os.path.dirname(__file__)
project_root = os.path.dirname(app_root)

db = SQLAlchemy()
migrate = Migrate(db=db, render_as_batch=True, compare_type=True, compare_server_default=True)
login = LoginManager()

uploaded_photos = UploadSet('photos')
def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    configure_uploads(app, uploaded_photos)
    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.appointment import bp as appointment_bp
    app.register_blueprint(appointment_bp)

    from app.order import bp as order_bp
    app.register_blueprint(order_bp)

    from app.user import bp as user_bp
    app.register_blueprint(user_bp)

    from app.question import bp as question_bp
    app.register_blueprint(question_bp)

    file_handler = RotatingFileHandler(os.path.join(project_root, 'logs', 'meirong.log'), maxBytes=100 * 1024 * 1024,
                                       backupCount=10, encoding='utf-8')
    file_handler.setLevel(logging.INFO)
    file_formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s %(lineno)d: %(message)s')
    file_handler.setFormatter(file_formatter)
    app.logger.addHandler(file_handler)

    return app

from app import models
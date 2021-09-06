from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_login import LoginManager
from flask_uploads import UploadSet, configure_uploads

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

    return app

from app import models
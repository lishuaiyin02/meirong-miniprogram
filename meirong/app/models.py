from app import db, login
from time import time
from datetime import datetime
from flask import current_app, request
from flask_login import UserMixin, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import and_
import jwt


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image = db.Column(db.String(128))
    nickname = db.Column(db.String(20), unique=True, index=True)
    realname = db.Column(db.String(20))
    password_hash = db.Column(db.String(128))
    phone = db.Column(db.String(16))
    sex = db.Column(db.String(20))
    birthday = db.Column(db.DateTime)

    def __repr__(self):
        return '<User {}>'.format(self.id)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_reset_password_token(self, expires_in=600000000):
        return jwt.encode(
            {'reset_password': self.id, 'exp': time() + expires_in},
            current_app.config['SECRET_KEY'],
            algorithm='HS256').decode('utf-8')

    @staticmethod
    def verify_reset_password_token(token):
        try:
            id = jwt.decode(token, current_app.config['SECRET_KEY'],
                            algorithms=['HS256'])['reset_password']
        except:
            return
        return User.query.get(id)


@login.user_loader
def load_user(user_id):
    return User.query.filter_by(id=user_id, valid=True).first()


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', foreign_keys='Order.user_id', backref='orders')
    content = db.Column(db.String(255), doc='预约内容')
    realname = db.Column(db.String(255), doc='预约人的真实姓名')
    phone = db.Column(db.String(15), doc='预约人的电话号码')
    datetime = db.Column(db.String(50), doc='预约时间')

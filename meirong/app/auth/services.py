from app import db
from app.models import User
from sqlalchemy.exc import DataError, DBAPIError


def login(data):
    try:
        username = data['username']
        password = data['password']
        user = User.query.filter(User.nickname == username).first()
        if user and user.check_password(password):
            return user
        else:
            return None
    except (DataError, DBAPIError) as ex:
        return False

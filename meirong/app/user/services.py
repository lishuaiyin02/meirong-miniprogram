from app import db
from app.models import User
from sqlalchemy.exc import DataError, DBAPIError


def getNicknames():
    try:
        nicknames = User.query.with_entities(User.nickname).all()
        return nicknames
    except:
        return None
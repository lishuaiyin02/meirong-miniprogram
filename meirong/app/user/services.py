from app import db
from app.models import User
from sqlalchemy.exc import DataError, DBAPIError


def getNicknames():
    try:
        nicknames = User.query.with_entities(User.nickname).all()
        return nicknames
    except:
        return None


def register(data):
    try:
        form = data['form']
        image = form['image']
        nickname = form['nickname']
        realname = form['realname']
        phone = form['phone']
        sex = form["sex"]
        birthday = form["birthday"]
        password = form["password"]
        user = User()
        user.image = image
        user.nickname = nickname
        user.realname = realname
        user.phone = phone
        user.sex = sex
        user.birthday = birthday
        user.set_password(password)

        db.session.add(user)
        db.session.commit()
        return user
    except:
        return None
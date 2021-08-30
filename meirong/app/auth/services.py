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
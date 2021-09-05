from app import db
from app.models import User
from sqlalchemy.exc import DataError, DBAPIError
import random


def generate_verification_code(len=6):
    ''' 随机生成6位的验证码 '''
    # 注意： 这里我们生成的是0-9A-Za-z的列表，当然你也可以指定这个list，这里很灵活
    # 比如： code_list = ['P','y','t','h','o','n','T','a','b'] # PythonTab的字母
    code_list = []
    for i in range(10): # 0-9数字
        code_list.append(str(i))
    for i in range(65, 91): # 对应从“A”到“Z”的ASCII码
        code_list.append(chr(i))
    for i in range(97, 123): #对应从“a”到“z”的ASCII码
        code_list.append(chr(i))
    myslice = random.sample(code_list, len)  # 从list中随机获取6个元素，作为一个片断返回
    verification_code = ''.join(myslice) # list to string
    return verification_code

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
        user = User.query.filter(User.nickname == nickname).first()
        if user is None:
            user = User()
            user.set_password(password)
            db.session.add(user)
            db.session.flush()
        user.image = image
        user.nickname = nickname
        user.realname = realname
        user.phone = phone
        user.sex = sex
        user.birthday = birthday

        db.session.commit()
        return user
    except:
        return None
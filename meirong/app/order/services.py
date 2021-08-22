from app import db
from app.models import Order
from sqlalchemy.exc import DataError, DBAPIError
from flask_login import current_user


def save_order(data):
    user_id = data['user_id']
    form = data['form']
    content = form['content']
    realname = form['realname']
    phone = form['phone']
    dateTime = form['dateTime']
    dateTimeArray = form['dateTimeArray']
    try:
        order = Order()
        order.content = content
        order.realname = realname
        order.phone = phone
        order.datetime = dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[1][dateTime[1]] + '-' +dateTimeArray[2][dateTime[2]] + ' ' + dateTimeArray[3][dateTime[3]] + ':' + dateTimeArray[4][dateTime[4]] + ':' +dateTimeArray[5][dateTime[5]]
        order.user_id = user_id
        db.session.add(order)
        db.session.commit()
        print(form,'\n',content,'\n',realname,'\n',phone,'\n',dateTime,'\n',dateTimeArray,'\n',user_id)
        return order
    except (DataError, DBAPIError) as ex:
        # current_app.logger.error(ex)
        return False
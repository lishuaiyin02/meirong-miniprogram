from app import db
from app.models import Order, ShopClassification
from sqlalchemy.exc import DataError, DBAPIError
from flask_login import current_user
from sqlalchemy import and_

def save_order(data):
    user_id = data['user_id']
    form = data['form']
    product = form['product']
    prices = form['prices']
    number = form['num']
    money = form['money']

    try:
        order = Order()
        order.product = product
        order.prices = prices
        order.number = number
        order.money = money
        order.user_id = user_id
        db.session.add(order)
        db.session.commit()
        print(form,'\n',product,'\n',prices,'\n',number,'\n',money,'\n',user_id)
        return order
    except (DataError, DBAPIError) as ex:
        # current_app.logger.error(ex)
        return False


def getOclassification():
    try:
        oclassification = ShopClassification.query.all()
        return oclassification
    except:
        return False

def getOrders(user_id):
    try:
        orders = Order.query.filter(and_(Order.user_id == user_id,
                                        Order.valid)).all()
        return orders
    except:
        return "False"


def cancelOrder(order_id):
    try:
        Order.query.filter(Order.id == order_id).update({'valid':False})
        db.session.commit()
        return True
    except (DataError, DBAPIError) as ex:
        print(ex)
        return False


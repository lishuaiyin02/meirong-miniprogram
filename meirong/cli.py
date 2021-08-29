def register(app):
    @app.cli.group()
    def generate():
        pass

    @generate.command()
    def init():
        from app.models import User, AppointmentClassification, AppointmentContent,\
            ShopClassification, ShopContent
        from app import db
        user = User(nickname='test')
        user.set_password('test')
        db.session.add(user)
        db.session.flush()
        appointmentclassification1 = AppointmentClassification(second_column='美瞳')
        appointmentcontent1 = AppointmentContent(content="接眉毛：90分钟")
        appointmentcontent2 = AppointmentContent(content="补睫毛：60分钟")
        appointmentclassification1.contents.append(appointmentcontent1)
        appointmentclassification1.contents.append(appointmentcontent2)

        appointmentclassification2 = AppointmentClassification(second_column='美甲')
        appointmentcontent1 = AppointmentContent(content="美甲:60分钟")
        appointmentclassification2.contents.append(appointmentcontent1)

        appointmentclassification3 = AppointmentClassification(second_column='美容')
        appointmentcontent1 = AppointmentContent(content="美容:90分钟")
        appointmentclassification3.contents.append(appointmentcontent1)


        appointmentclassification4 = AppointmentClassification(second_column='身体')
        appointmentcontent1 = AppointmentContent(content="身体:90分钟")
        appointmentclassification4.contents.append(appointmentcontent1)


        appointmentclassification5 = AppointmentClassification(second_column='减肥')
        appointmentcontent1 = AppointmentContent(content="减肥:20分钟")
        appointmentcontent2 = AppointmentContent(content="减肥:40分钟")
        appointmentclassification5.contents.append(appointmentcontent1)
        appointmentclassification5.contents.append(appointmentcontent2)

        db.session.add_all([appointmentclassification1, appointmentclassification2,
                            appointmentclassification3, appointmentclassification4,
                            appointmentclassification5])
        db.session.flush()

        shopclassification1 = ShopClassification(second_column="彩妆")
        shopcontent1 = ShopContent(content="彩妆1")
        shopcontent2 = ShopContent(content="彩妆2")
        shopcontent3 = ShopContent(content="彩妆3")
        shopclassification1.contents.append(shopcontent1)
        shopclassification1.contents.append(shopcontent2)
        shopclassification1.contents.append(shopcontent3)

        shopclassification2 = ShopClassification(second_column="护肤")
        shopcontent1 = ShopContent(content="护肤1")
        shopcontent2 = ShopContent(content="护肤2")
        shopcontent3 = ShopContent(content="护肤3")
        shopclassification2.contents.append(shopcontent1)
        shopclassification2.contents.append(shopcontent2)
        shopclassification2.contents.append(shopcontent3)

        shopclassification3 = ShopClassification(second_column="治疗")
        shopcontent1 = ShopContent(content="治疗1")
        shopcontent2 = ShopContent(content="治疗2")
        shopcontent3 = ShopContent(content="治疗3")
        shopclassification3.contents.append(shopcontent1)
        shopclassification3.contents.append(shopcontent2)
        shopclassification3.contents.append(shopcontent3)

        shopclassification4 = ShopClassification(second_column="私密")
        shopcontent1 = ShopContent(content="私密1")
        shopcontent2 = ShopContent(content="私密2")
        shopcontent3 = ShopContent(content="私密3")
        shopclassification4.contents.append(shopcontent1)
        shopclassification4.contents.append(shopcontent2)
        shopclassification4.contents.append(shopcontent3)

        shopclassification5 = ShopClassification(second_column="头发")
        shopcontent1 = ShopContent(content="头发1")
        shopcontent2 = ShopContent(content="头发2")
        shopcontent3 = ShopContent(content="头发3")
        shopclassification5.contents.append(shopcontent1)
        shopclassification5.contents.append(shopcontent2)
        shopclassification5.contents.append(shopcontent3)

        shopclassification6 = ShopClassification(second_column="男士")
        shopcontent1 = ShopContent(content="男士1")
        shopcontent2 = ShopContent(content="男士2")
        shopcontent3 = ShopContent(content="男士3")
        shopclassification6.contents.append(shopcontent1)
        shopclassification6.contents.append(shopcontent2)
        shopclassification6.contents.append(shopcontent3)

        db.session.add_all([shopclassification1,shopclassification2,shopclassification3,shopclassification4,
                            shopclassification5,shopclassification6])

        db.session.commit()

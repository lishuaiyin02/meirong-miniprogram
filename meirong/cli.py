def register(app):
    @app.cli.group()
    def generate():
        pass

    @generate.command()
    def init():
        from app.models import User
        from app import db
        user = User(nickname='test')
        user.set_password('test')
        db.session.add(user)
        db.session.commit()

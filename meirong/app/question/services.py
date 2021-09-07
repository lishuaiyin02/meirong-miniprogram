from app import db
from app.models import Question
from sqlalchemy.exc import DataError, DBAPIError


def getQuestions():
    try:
        questions = Question.query.filter(Question.valid).all()
        return questions
    except (DataError, DBAPIError) as ex:
        return "False"
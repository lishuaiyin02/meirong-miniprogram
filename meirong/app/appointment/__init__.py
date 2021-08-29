from flask import Blueprint

bp = Blueprint('appointment', __name__)

from app.appointment import routes
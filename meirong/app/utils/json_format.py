import datetime
import enum

from flask import json
from sqlalchemy.orm import class_mapper

def json_format(data):
    if isinstance(data, list):
        result = []
        for obj in data:
            result.append(as_dict(obj))
        return result
    elif isinstance(data, enum.EnumMeta):
        result_json = {}
        for obj in data:
            result_json[str(obj._name_)] = str(obj.value)
        return result_json
    else:
        return as_dict(data)

def as_dict(obj):
    dictObj = dict((col.name, datetime.datetime.strftime(getattr(obj, col.name), "%Y/%m/%d %H:%M:%S"))
                   if type(getattr(obj, col.name)) == datetime.datetime
                   else (col.name, getattr(obj, col.name))
                   for col in class_mapper(obj.__class__).mapped_table.c)
    return json.loads(json.dumps(dictObj))
from flask import Blueprint, jsonify, render_template
from .models import HexTile

bp = Blueprint('main', __name__)

@bp.route('/')
def map_view():
    return render_template('map.html')

@bp.route('/api/tiles')
def get_tiles():
    tiles = HexTile.query.all()
    return jsonify([{
        'q': tile.q,
        'r': tile.r,
        'elevation': tile.elevation,
        'type': tile.type,
        'notes': tile.notes
    } for tile in tiles])

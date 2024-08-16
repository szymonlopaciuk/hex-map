from . import db

class HexTile(db.Model):
    __tablename__ = 'hex_tiles'

    id = db.Column(db.Integer, primary_key=True)
    q = db.Column(db.Integer, nullable=False)
    r = db.Column(db.Integer, nullable=False)
    elevation = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(7), nullable=False)  # Hex color code
    notes = db.Column(db.String, nullable=True)

    def __repr__(self):
        return f"<HexTile (Q={self.q}, R={self.r}, Type={self.type})>"

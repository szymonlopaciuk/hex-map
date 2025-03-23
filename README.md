# Hex Map App

## How to setup and run?

Easiest with the provided Docker Compose scripts. First install Docker (or better, Podman!) with the `docker-compose`/`podman compose` extensions.

To run the developer version (which should take care of rebuilding as the project is edited) execute the following:

```bash
podman compose -f docker-compose.dev.yaml up
```

Use the `docker-compose.yaml` file instead to run the "production" version.

The project is compatible with Podman, so `podman compose` can be used too.

One the containers are built and the project is up, navigate to `http://127.0.0.1:8080/` open the app.

## Database migrations

On first run it will be necessary to set up the database and apply migrations:

```bash
# First bring the application up with docker-compose
# The -d flag is for running in the background (use down to stop)
podman compose -f docker-compose.dev.yaml up -d
# Initialise the DB and run migrations
docker-compose exec backend poetry run flask db init
docker-compose exec backend poetry run flask db migrate -m "Initial migration."
docker-compose exec backend poetry run flask db upgrade
```

We can populate the database with some dummy values:

```bash
docker-compose exec backend poetry run flask shell
```

then inside the shell:

```python
from app import db
from app.models import HexTile

# Create some sample tiles
tiles = [
    HexTile(q=0, r=0, elevation=10.0, type="#FF5733", notes="Center tile"),
    HexTile(q=1, r=0, elevation=12.0, type="#33FF57", notes="Adjacent tile 1"),
    HexTile(q=0, r=1, elevation=14.0, type="#3357FF", notes="Adjacent tile 2"),
]

db.session.add_all(tiles)
db.session.commit()
```


# Dockerfile

FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy pyproject.toml and poetry.lock
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --no-dev --no-root

# Copy project files
COPY . .

# Expose the port
EXPOSE 8899

# Command to run the Flask app
CMD ["poetry", "run", "python", "run.py"]
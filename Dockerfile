# Utiliser une image de base Python
FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers requirements.txt et le script Python dans le conteneur
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py app.py
COPY .env .env

# Exposer le port sur lequel l'API va tourner
EXPOSE 5050

# Commande pour exécuter l'application
CMD ["python", "app.py"]

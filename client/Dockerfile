# Utiliser une image Node.js comme base
FROM node:latest

# Créer un répertoire de travail pour l'application
WORKDIR /app

# Copier le fichier package.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances de l'application
RUN yarn install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Construire l'application React
RUN yarn run build

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer l'application
CMD [ "yarn", "start" ]

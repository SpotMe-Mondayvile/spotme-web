FROM node:18-alpine

EXPOSE 8100
EXPOSE 3000
EXPOSE 5000
EXPOSE 5173
EXPOSE 50000

WORKDIR /spotme-web/
COPY . ./
COPY public/ /spotme-web/public
COPY src/ /spotme-web/src
COPY package.json /spotme-web/

RUN npm install -g jwt-decode
RUN npm install -g axios
RUN npm install -g @ionic/cli
RUN npm run build_dev



ENTRYPOINT ["npm","run","dev","--","--host"]
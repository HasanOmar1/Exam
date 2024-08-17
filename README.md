# Tolstoy Exam

### Instructions

![instructions](./instructions.png)

---

#### Link To The Site

- Frontend : https://hasan-tolstoy-exam.netlify.app/
- Backend : https://exam-fvai.onrender.com/

Things to know:

Im using free Render tier to host my server so the server might not work as intended because it takes long time to scrape the data which leads to navigation timeout error. <br>
One of the solutions to fix that is to remove the rateLimiter and it work fine but it still takes time to scrape the data. <br>
Setup the server locally and it will scrape pretty quickly.

---

# Instructions for setting up the project

## Client

You have to create .env file and configure it with the following environment variable:

```
VITE_BACKEND_URL = [The link to your server]
```

To run the client you have to open the terminal and type:

```
cd client
npm install
npm run dev
```

---

## Server

You have to create .env file and configure it with the following environment variable:

```
NODE_ENV = [locally = dev / On Render = production ]
PORT = [Your port number]
CLIENT_LINK = [The link to your frontend]
```

---

**_ To deploy the server on render you have to add these docker environment variables for puppeteer to work _**

```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
PUPPETEER_EXECUTABLE_PATH = /usr/bin/google-chrome-stable
```

---

To run the server you have to open the terminal and type:

```
cd server
npm install
npm run dev
```

---

## Used technologies

#### Frontend

- Typescript

#### Backend

- ExpressJS
- Express-rate-limit
- Cors
- Dotenv
- Puppeteer
- Puppeteer-extra
- Puppeteer-extra-plugin-stealth
- Mocha
- Chai
- Supertest
- Helmet

---

#### Route example for testing

```
[server Link]/fetch-metadata?urls=https://www.facebook.com/&urls=https://www.google.com/&urls=https://www.gotolstoy.com/&urls=https://www.tesla.com/
```

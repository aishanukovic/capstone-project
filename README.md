
# Capstone Project: Naturopathia

**Naturopathia** is a full-stack web application offering personalized, AI-powered holistic health recommendations. Users can upload health data, complete a diagnostic questionnaire, and interact with an intelligent virtual assistant (Holly) that provides tailored insights based on user data.

---

## Features

- AI-powered virtual naturopathic consultation (OpenAI GPT-4-turbo)
- Health profile management and data uploads
- Diagnostic intake questionnaire
- Chat system with memory based on user data
- Secure Auth0 authentication
- OCR scan support (Google Vision API)
- Tailored dashboard and progress tracker

---

## Tech Stack

- **Frontend:** React.js (with Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** Auth0 (with JWT)
- **AI/ML:** OpenAI GPT-4-turbo
- **File Handling:** Cloudinary + Google Vision API OCR
- **Deployment Tools:** Netlify (frontend), Render (backend)

---

## Project Setup

### 1. **Clone the Repository**

```bash
git clone https://github.com/aishanukovic/capstone-project.git
cd capstone-project
```

### 2. **Install Dependencies**

#### Frontend (`capstone-web`)

```bash
cd capstone-web
npm install
```

#### Backend (`capstone-backend`)

```bash
cd ../capstone-backend
npm install
```

---

## Environment Variables Setup

### Create `.env` files in both frontend and backend directories:

---

### `capstone-web/.env`

```
VITE_API_URL=http://localhost:5000/api
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://capstone-api
```

---

### `capstone-backend/.env`

```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
AUTH0_AUDIENCE=https://capstone-api
AUTH0_ISSUER_BASE_URL=https://your-auth0-domain/
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
OPENAI_API_KEY=your-openai-key
GOOGLE_APPLICATION_CREDENTIALS=./path-to-your-service-account-key.json
```

---

## Additional Setup Instructions

### Google Vision API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the **Cloud Vision API**
3. Create a **service account** and download the JSON key
4. Place the JSON file in `capstone-backend/`
5. Reference the JSON path in `.env` using `GOOGLE_APPLICATION_CREDENTIALS`

### Auth0 Setup

1. Sign up at [Auth0](https://auth0.com/)
2. Create a new **Regular Web Application**
3. Set the following values in the dashboard:
   - **Callback URL:** `http://localhost:5173`
   - **Logout URL:** `http://localhost:5173`
4. Grab your **domain**, **client ID**, and **audience** for `.env`

---

## Running the Application

### 1. **Start the Backend**

```bash
cd capstone-backend
npm run dev
```

### 2. **Start the Frontend**

```bash
cd ../capstone-web
npm run dev
```

### 3. **Open in Browser**

Go to [http://localhost:5173](http://localhost:5173) to access the app.

---

## Testing & Troubleshooting

- If `npm install` fails, try deleting `node_modules` and `package-lock.json`, then reinstall.
- Make sure your MongoDB URI is valid and your IP is whitelisted.
- Ensure Google Vision service account JSON is in the correct path and not ignored by `.gitignore`.
- If the chatbot isn't responding, check that your OpenAI API key is set correctly and you are using `gpt-4-turbo`.

---

## Folder Structure

```
capstone-project/
│
├── capstone-web/       → Frontend (React + Tailwind)
├── capstone-backend/       → Backend (Node + Express + MongoDB)
└── README.md           → Project documentation
```

---

## Deployment Tips

- Use **Netlify** for the frontend and enable environment variables in their dashboard
- Use **Render**, **Railway**, or **Fly.io** for the backend with persistent environment settings
- Protect sensitive data using `.env` and make sure to `.gitignore` it
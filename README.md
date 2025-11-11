# FarmerGPT - Smart Farming Assistant

A comprehensive web application designed to help farmers make better farming decisions through smart insights and easy-to-use tools. Built with Django REST Framework backend and React frontend.

## Features

- **User Authentication**: Secure login and registration for farmers
- **Personal Dashboard**: View all farming information in one place
- **Crop Management**: Add, edit, and track multiple crops with different statuses
- **Weather Information**: Real-time weather data and forecasts for better planning
- **Crop Suggestions**: Get expert tips and best practices for various crops
- **AI Chatbot**: Ask farming questions and get instant AI-powered advice

## Tech Stack

### Backend
- Django 4.2.7
- Django REST Framework
- JWT Authentication
- SQLite Database
- OpenAI API (for chatbot)
- OpenWeatherMap API (for weather data)

### Frontend
- React 18
- Vite
- React Router
- Axios

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
cd project2
```

### 2. Backend Setup

#### Step 1: Create Virtual Environment

```bash
cd backend
python -m venv venv
```

#### Step 2: Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

#### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
OPENAI_API_KEY=your-openai-api-key-here
WEATHER_API_KEY=your-openweathermap-api-key-here
```

**Getting API Keys and Secret Key:**

##### 1. Django SECRET_KEY
Generate a Django secret key using Python:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Copy the output and paste it as your SECRET_KEY in the .env file.

##### 2. OpenWeatherMap API Key (Required for Weather Feature)
1. Go to https://openweathermap.org/
2. Click "Sign Up" and create a free account
3. After logging in, go to "API keys" section in your account
4. Copy the default API key or create a new one
5. Paste it in the .env file as WEATHER_API_KEY
6. Note: Free tier allows 1000 calls/day, which is sufficient for this application

##### 3. OpenAI API Key (Optional - Chatbot works without it)
1. Go to https://platform.openai.com/
2. Sign up or log in to your account
3. Navigate to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (you won't be able to see it again!)
6. Paste it in the .env file as OPENAI_API_KEY
7. Note: OpenAI API requires adding payment method. If you don't add the key, the chatbot will use fallback rule-based responses

#### Step 5: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Step 6: Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

#### Step 7: Start Backend Server

```bash
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal window:

#### Step 1: Navigate to Frontend

```bash
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Start Development Server

```bash
npm run dev
```

Frontend will run at: `http://localhost:3000`

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Register a new farmer account with your details
3. Login with your credentials
4. Access the dashboard to:
   - View weather information for your location
   - Add and manage your crops
   - Get crop-specific farming suggestions
   - Chat with the AI assistant for farming advice

## Project Structure

```
project2/
├── backend/
│   ├── farmergpt/          # Django project settings
│   ├── farming/            # Main Django app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # DRF serializers
│   │   ├── urls.py         # URL routing
│   │   └── admin.py        # Admin configuration
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Weather.jsx
│   │   │   ├── CropList.jsx
│   │   │   ├── CropSuggestions.jsx
│   │   │   └── Chatbot.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/user/` - Get current user details

### Profile
- `GET /api/profile/` - Get farmer profile
- `PATCH /api/profile/` - Update farmer profile

### Crops
- `GET /api/crops/` - List all crops
- `POST /api/crops/` - Create new crop
- `GET /api/crops/{id}/` - Get crop details
- `PATCH /api/crops/{id}/` - Update crop
- `DELETE /api/crops/{id}/` - Delete crop

### Weather
- `GET /api/weather/?location=Delhi` - Get weather data for location

### Crop Suggestions
- `GET /api/suggestions/` - Get all crop suggestions
- `GET /api/suggestions/?crop=wheat` - Get suggestions for specific crop

### Chatbot
- `POST /api/chatbot/` - Send message to AI chatbot

## Features Explained

### 1. User Authentication
- Secure registration with profile creation
- JWT-based authentication
- Password validation

### 2. Crop Management
- Add multiple crops with details (name, variety, area, dates)
- Track crop status (planning, planted, growing, harvested)
- Edit and delete crops
- View all crops in organized sections

### 3. Weather Information
- Real-time weather data from OpenWeatherMap
- Current conditions (temperature, humidity, wind speed)
- 24-hour forecast
- Search weather by location

### 4. Crop Suggestions
- Predefined suggestions for popular crops (wheat, rice, corn, cotton, tomato)
- Best season, temperature, soil requirements
- Water requirements
- Farming tips and best practices
- Common disease information

### 5. AI Chatbot
- AI-powered farming assistant using OpenAI
- Fallback rule-based responses when OpenAI not configured
- Quick question buttons
- Real-time chat interface

## Troubleshooting

### Backend Issues

**Migration Errors:**
```bash
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

**Port Already in Use:**
```bash
python manage.py runserver 8001
```

### Frontend Issues

**Port Already in Use:**
Edit `vite.config.js` and change the port number.

**Module Not Found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

Make sure:
1. Backend server is running on port 8000
2. Frontend proxy is configured correctly in `vite.config.js`
3. CORS is enabled in Django settings

## How to Run the Complete Project

Follow these steps to run both backend and frontend together:

### Step 1: Start the Backend Server
Open a terminal in the project directory:
```bash
cd backend
python manage.py runserver
```
Keep this terminal running. Backend will be available at http://localhost:8000

### Step 2: Start the Frontend Server
Open a NEW terminal in the project directory:
```bash
cd frontend
npm run dev
```
Keep this terminal running. Frontend will be available at http://localhost:3000

### Step 3: Access the Application
Open your web browser and go to http://localhost:3000

You should now have:
- Frontend running on port 3000
- Backend API running on port 8000
- Database file created at backend/db.sqlite3

## Free Deployment Options

### Option 1: Deploy on Render (Recommended - Easiest)

#### Backend Deployment on Render:
1. Push your code to GitHub
2. Go to https://render.com/ and sign up (free)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: farmergpt-backend
   - Root Directory: backend
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn farmergpt.wsgi:application`
6. Add Environment Variables in Render dashboard:
   - SECRET_KEY: (generate new one)
   - DEBUG: False
   - WEATHER_API_KEY: (your key)
   - OPENAI_API_KEY: (your key - optional)
7. Click "Create Web Service"
8. Note the URL provided (e.g., https://farmergpt-backend.onrender.com)

#### Frontend Deployment on Render:
1. In Render dashboard, click "New +" and select "Static Site"
2. Connect your GitHub repository
3. Configure:
   - Name: farmergpt-frontend
   - Root Directory: frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: dist
4. Add Environment Variable:
   - VITE_API_URL: (your backend URL from above)
5. Update frontend/src/services/api.js:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
   ```
6. Click "Create Static Site"

**Note:** Render free tier may sleep after inactivity. First request may take 50 seconds to wake up.

### Option 2: Deploy on Railway

#### Backend on Railway:
1. Go to https://railway.app/ and sign up (free)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables (same as Render)
5. Railway will auto-detect Django and deploy
6. Free tier: 500 hours/month, $5 credit

#### Frontend on Railway:
1. Create new project from same repository
2. Set Root Directory to frontend
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `npm run preview`

### Option 3: Deploy on PythonAnywhere + Vercel

#### Backend on PythonAnywhere:
1. Sign up at https://www.pythonanywhere.com/ (free tier)
2. Create a new web app (Django)
3. Upload your code via Git or Files
4. Configure WSGI file
5. Set environment variables in virtualenv
6. Free tier includes: 512MB storage, 1 web app

#### Frontend on Vercel:
1. Go to https://vercel.com/ and sign up
2. Import your GitHub repository
3. Configure:
   - Root Directory: frontend
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: dist
4. Add environment variable for backend URL
5. Deploy - unlimited bandwidth on free tier

### Option 4: Deploy on Heroku

#### Backend on Heroku:
1. Sign up at https://heroku.com/ (free tier limited)
2. Install Heroku CLI
3. In backend folder, create `Procfile`:
   ```
   web: gunicorn farmergpt.wsgi
   ```
4. Create `runtime.txt`:
   ```
   python-3.12.0
   ```
5. Add gunicorn to requirements.txt:
   ```
   gunicorn==21.2.0
   ```
6. Deploy:
   ```bash
   heroku login
   heroku create farmergpt-backend
   git push heroku main
   heroku config:set SECRET_KEY=xxx
   heroku config:set WEATHER_API_KEY=xxx
   ```

#### Frontend on Netlify:
1. Go to https://netlify.com/ and sign up
2. Drag and drop your frontend/dist folder (after building)
3. Or connect GitHub for automatic deployments
4. Free tier: 100GB bandwidth/month

### Important Notes for Deployment:

1. **Update Django Settings for Production:**
   ```python
   ALLOWED_HOSTS = ['your-domain.com', 'localhost']
   CORS_ALLOWED_ORIGINS = [
       'https://your-frontend-domain.com',
       'http://localhost:3000',
   ]
   ```

2. **Add gunicorn to requirements.txt:**
   ```
   gunicorn==21.2.0
   ```

3. **Create backend/Procfile for some platforms:**
   ```
   web: gunicorn farmergpt.wsgi:application
   ```

4. **Collect Static Files (if needed):**
   ```bash
   python manage.py collectstatic
   ```

5. **Use PostgreSQL for production** (most platforms offer free tier):
   - Add to requirements.txt: `psycopg2-binary==2.9.9`
   - Update DATABASE settings in settings.py

### Free Tier Comparison:

| Platform | Storage | Bandwidth | Database | Sleep Policy |
|----------|---------|-----------|----------|--------------|
| Render | 512MB | 100GB/mo | 1GB PostgreSQL | Sleeps after 15min |
| Railway | 1GB | Unlimited | 1GB PostgreSQL | 500 hrs/month |
| PythonAnywhere | 512MB | Limited | 200MB MySQL | Always on |
| Heroku | 512MB | - | 1GB PostgreSQL | Sleeps after 30min |
| Vercel (Frontend) | 100GB | Unlimited | - | Always on |
| Netlify (Frontend) | 100GB | 100GB/mo | - | Always on |

### Recommended Stack for Free Deployment:
- **Backend**: Render or Railway
- **Frontend**: Vercel or Netlify
- **Database**: Use PostgreSQL provided by Render/Railway (free tier)

## Contributing

This is an assignment project. Feel free to fork and modify for your needs.

## License

This project is created for educational purposes.

## Contact

For issues or questions, please create an issue in the repository.

## Quick Start Summary

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Access at http://localhost:3000
```

---

Built with ❤️ for farmers

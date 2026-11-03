# AgriGrow AI

Build a full-stack AI-powered web application called “AgriSmart: Crop Yield Prediction & Optimization System”.

🎯 OBJECTIVE:

The application should help farmers, researchers, and agricultural planners predict crop yield and provide actionable recommendations to maximize productivity using AI and real-world data.

🧠 CORE FEATURES:

1. 🌾 Crop Yield Prediction

- Input parameters:

  - Soil type

  - Temperature (°C)

  - Rainfall (mm)

  - Humidity (%)

  - Crop type

  - Fertilizer usage

  - Region/location

- Use a Machine Learning model (Random Forest or XGBoost preferred)

- Output:

  - Predicted yield (tons/hectare)

  - Confidence score

2. 📊 Smart Crop Recommendation

- Suggest best crops based on:

  - Soil + weather + season

- Display top 3 crop suggestions with reasoning

3. 🌦 Weather Integration (Real-time or simulated API)

- Show current weather + forecast

- Give warnings (drought, heavy rain, etc.)

4. 🧪 Fertilizer Optimization

- Suggest optimal fertilizer type and quantity

- Prevent overuse (eco-friendly suggestions)

5. 🗺 Region-Based Insights

- Use maps to show:

  - Suitable crops by region

  - Historical yield trends

6. 🤖 AI Chatbot Assistant

- Farmer-friendly chatbot

- Answer queries like:

  - “What should I grow this season?”

  - “How to improve yield for wheat?”

7. 📈 Data Visualization Dashboard

- Graphs:

  - Yield trends

  - Weather vs yield correlation

  - Crop comparison charts

8. 🔔 Smart Alerts System

- Notify:

  - Weather risks

  - Fertilizer timing

  - Irrigation reminders

---

💡 ADVANCED / UNIQUE FEATURES (IMPORTANT):

9. 🧠 Yield Optimization Engine

- Suggest:

  - Best planting time

  - Irrigation schedule

  - Crop rotation strategies

10. 📷 Image-Based Crop Health Detection

- Upload plant image

- Detect disease using a simple CNN model

- Suggest remedies

11. 🌍 Sustainability Score

- Calculate eco-score based on:

  - Water usage

  - Fertilizer use

  - Crop choice

12. 🧾 Report Generator

- Generate downloadable PDF report:

  - Predictions

  - Recommendations

  - Graphs

---

🛠 TECH STACK REQUIREMENTS:

Frontend:

- React.js (with clean UI, responsive design)

- Tailwind CSS or Material UI

Backend:

- Python (Flask or Django)

Machine Learning:

- Scikit-learn / TensorFlow / XGBoost

- Pre-train model using sample agricultural dataset

Database:

- MongoDB or PostgreSQL

APIs:

- Weather API (OpenWeatherMap or mock API)

---

📂 DATASET:

- Use publicly available datasets:

  - Crop yield dataset

  - Soil dataset

  - Weather dataset

- If not available, generate realistic synthetic data

---

🎨 UI/UX REQUIREMENTS:

- Clean farmer-friendly interface

- Dashboard with cards and charts

- Input form + results page

- Dark/light mode optional

---

🚀 OUTPUT EXPECTATION:

- Fully working web application

- Modular code (frontend + backend)

- Trained ML model included

- Sample dataset included

- README with setup instructions

---

📌 BONUS (if possible):

- Mobile-friendly design

- Multi-language support (English + local language)

- Voice input for farmers

---

Make sure the app is production-like, visually appealing, and suitable for a college mini project demonstration.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://yieldnova.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ca973847-8228-462b-bce0-d6a6a7c0f9f7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

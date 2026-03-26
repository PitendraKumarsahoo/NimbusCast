# ⛈ NimbusCast — Smart Weather Intelligence

![NimbusCast Banner](https://img.shields.io/badge/NimbusCast-Weather%20App-38bdf8?style=for-the-badge&logo=cloud&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> A professional, real-time weather intelligence web application with 7-day forecasts, hourly breakdown, air quality index, smart insights, and a fully responsive dark/light UI.

🔗 **Live Demo:** [nimbus-cast.vercel.app](https://nimbuscast-weather.vercel.app/)

---

## 📸 Preview

| Dashboard (Dark) | Forecast | Analytics |
|---|---|---|
| ![dashboard](.github/preview-dashboard.png) | ![forecast](.github/preview-forecast.png) | ![analytics](.github/preview-analytics.png) |

---

## ✨ Features

- 🌍 **Real-time Weather** — Live data for any city worldwide via WeatherAPI
- 📅 **7-Day Forecast** — Daily high/low, condition, and rain probability
- 🕐 **24-Hour Hourly Breakdown** — Horizontal scrollable with current hour highlighted
- 📊 **Weather Analytics** — Comfort index (heat index formula), wind category, UV index, 7-day temperature trend chart
- 🤖 **Smart Insights** — Auto-generated tips for heat, rain, UV, humidity, wind, and tomorrow's forecast
- 💨 **Air Quality Index** — EPA scale with animated color bar
- 📌 **Saved Cities** — Save/remove favourite cities (persists via localStorage)
- 📍 **GPS Location** — Auto-detect and fetch weather for your current location
- 🌙 **Dark / Light Theme** — Full toggle, smooth transitions
- 🔄 **Auto Refresh** — Data refreshes silently every 5 minutes
- 📱 **Fully Responsive** — Mobile drawer sidebar, fluid grid layouts

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | App structure and semantic markup |
| CSS3 | Custom design system, animations, responsive layout |
| Vanilla JavaScript (ES6+) | All logic, API calls, DOM manipulation |
| [WeatherAPI.com](https://www.weatherapi.com/) | Live weather, forecast, AQI data |
| Vercel | Hosting and deployment |
| localStorage | Saved cities persistence |

---

## 📁 Project Structure
```
NimbusCast/
├── index.html      # App structure — sidebar, tabs, cards, search
├── style.css       # Full design system — tokens, layout, components
└── script.js       # All logic — API, rendering, analytics, storage
```

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/PitendraKumarsahoo/NimbusCast.git
cd NimbusCast
```

### 2. Open in browser
No build step needed. Simply open `index.html` in any browser:
```bash
# Double-click index.html
# OR use VS Code Live Server extension
```

### 3. API Key (already included)
The project uses [WeatherAPI.com](https://www.weatherapi.com/). A working API key is already embedded in `script.js`. To use your own:
1. Register free at weatherapi.com
2. Copy your key
3. In `script.js` replace line 4:
```js
const API_KEY = "YOUR_API_KEY_HERE";
```

---

## 🌐 Deployment (Vercel)

This project is deployed on **Vercel** with zero configuration.

To deploy your own copy:
1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import your fork
3. Framework: **Other** | Build command: *(leave blank)* | Output: *(leave blank)*
4. Click Deploy ✅

---

## 📊 App Sections

### 🌐 Dashboard
Main view showing current temperature, weather icon, condition, and 6 key stats (feels like, humidity, wind, UV, visibility, pressure). Also includes sunrise/sunset, precipitation, cloud cover, and AQI.

### 📅 7-Day Forecast
Card grid showing each day's high/low temperature, weather icon, condition text, and rain probability percentage.

### 🕐 Hourly Breakdown
Horizontal scroll of 24 hourly cards with temperature, rain %, and wind speed. Current hour is highlighted.

### 📊 Analytics
- **Comfort Index** — Heat index calculated from temp + humidity
- **Wind Conditions** — Categorized from Calm to Dangerous
- **UV Index** — With protection recommendations
- **7-Day Temp Trend** — Visual bar chart

### 🤖 Smart Insights
6+ dynamically generated weather tips based on live conditions.

### 📌 Saved Cities
Save multiple cities. Click any saved card to instantly load its weather.

---

## 🧠 Key Concepts Used

- Fetch API with async/await pattern
- DOM manipulation and dynamic HTML rendering
- CSS custom properties (design tokens)
- CSS Grid and Flexbox for responsive layouts
- localStorage for client-side persistence
- Geolocation Web API
- Heat Index formula (Steadman approximation)
- EPA Air Quality Index mapping

---

## 👨‍💻 Developer

**Pitendra Kumar Sahoo**
B.Tech Computer Science & Engineering — GIET University, Gunupur, Odisha
Roll No: 23CSE357

[![GitHub](https://img.shields.io/badge/GitHub-PitendraKumarsahoo-181717?style=flat-square&logo=github)](https://github.com/PitendraKumarsahoo)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with 💙 using HTML, CSS & JavaScript | Powered by WeatherAPI.com

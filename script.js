/* ===========================
   NIMBUS CAST — script.js
   =========================== */

   const API_KEY = "5d4dc1dc10c84285ae0114227252412";
   let currentData   = null;
   let currentCity   = "";
   let unitCelsius   = true;
   let savedCities   = JSON.parse(localStorage.getItem("nimbus_saved") || "[]");
   let savedWeather  = JSON.parse(localStorage.getItem("nimbus_savedWeather") || "{}");
   
   /* ─── INIT ──────────────────────────────────── */
   document.addEventListener("DOMContentLoaded", () => {
     renderSavedCities();
     setInterval(() => {
       if (currentCity) refreshWeather();
     }, 5 * 60 * 1000); // auto-refresh every 5 min
   });
   
   /* ─── SIDEBAR ─────────────────────────────── */
   function toggleSidebar() {
     const sidebar = document.getElementById("sidebar");
     if (window.innerWidth <= 768) {
       sidebar.classList.toggle("mobile-open");
     } else {
       sidebar.classList.toggle("collapsed");
     }
   }
   
   /* ─── THEME ─────────────────────────────────── */
   function toggleTheme() {
     const html      = document.documentElement;
     const isDark    = html.getAttribute("data-theme") === "dark";
     const themeIcon = document.getElementById("themeIcon");
     const themeBtn  = document.getElementById("themeToggle");
     html.setAttribute("data-theme", isDark ? "light" : "dark");
     themeIcon.textContent = isDark ? "🌙" : "☀️";
     themeBtn.innerHTML    = `<span id="themeIcon">${isDark ? "🌙" : "☀️"}</span> ${isDark ? "Dark Mode" : "Light Mode"}`;
   }
   
   /* ─── TABS ───────────────────────────────────── */
   function switchTab(tabName, btn) {
     document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
     document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
     document.getElementById(`tab-${tabName}`).classList.add("active");
     btn.classList.add("active");
   }
   
   /* ─── SEARCH ─────────────────────────────────── */
   function getWeather(cityOverride) {
     const city = cityOverride || document.getElementById("cityInput").value.trim();
     if (!city) return;
     currentCity = city;
     showLoading(true);
     closeError();
   
     const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=7&aqi=yes&alerts=yes`;
   
     fetch(url)
       .then(res => {
         if (!res.ok) throw new Error("Not found");
         return res.json();
       })
       .then(data => {
         currentData = data;
         showLoading(false);
         populateAll(data);
         document.getElementById("cityInput").value = "";
       })
       .catch(() => {
         showLoading(false);
         showError("City not found. Please check the spelling and try again.");
       });
   }
   
   function refreshWeather() {
     if (currentCity) getWeather(currentCity);
   }
   
   function getLocation() {
     if (!navigator.geolocation) return showError("Geolocation is not supported by your browser.");
     navigator.geolocation.getCurrentPosition(
       pos => getWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
       ()  => showError("Location access denied. Please enable GPS.")
     );
   }
   
   /* ─── POPULATE ALL SECTIONS ─────────────────── */
   function populateAll(data) {
     const c   = data.current;
     const loc = data.location;
     const f   = data.forecast.forecastday;
   
     // Show/hide empty state
     document.getElementById("emptyState").classList.add("hidden");
     document.getElementById("heroCard").classList.remove("hidden");
     document.getElementById("metricsGrid").classList.remove("hidden");
     document.getElementById("aqiStrip").classList.remove("hidden");
   
     // Update timestamp
     document.getElementById("lastUpdated").textContent =
       `Updated: ${new Date().toLocaleTimeString()}`;
   
     populateHero(c, loc);
     populateMetrics(c, f[0]);
     populateAQI(c.air_quality);
     populateForecast(f);
     populateHourly(f[0].hour);
     populateAnalytics(data);
   }
   
   /* ─── HERO ───────────────────────────────────── */
   function populateHero(c, loc) {
     document.getElementById("heroCity").textContent    = loc.name;
     document.getElementById("heroCountry").textContent = `${loc.region}, ${loc.country}`;
     document.getElementById("heroTemp").textContent    = unitCelsius ? c.temp_c : c.temp_f;
     document.getElementById("heroCondition").textContent = c.condition.text;
     document.getElementById("heroIcon").src            = "https:" + c.condition.icon;
     document.getElementById("heroFeels").textContent   = `${unitCelsius ? c.feelslike_c : c.feelslike_f}°`;
     document.getElementById("heroHumidity").textContent = `${c.humidity}%`;
     document.getElementById("heroWind").textContent    = `${c.wind_kph} km/h`;
     document.getElementById("heroUV").textContent      = uvLabel(c.uv);
     document.getElementById("heroVis").textContent     = `${c.vis_km} km`;
     document.getElementById("heroPressure").textContent = `${c.pressure_mb} mb`;
     document.getElementById("heroDateTime").textContent =
       `Local time: ${loc.localtime}  |  Lat ${loc.lat}, Lon ${loc.lon}`;
   }
   
   /* ─── METRICS ─────────────────────────────────── */
   function populateMetrics(c, today) {
     const astro = today.astro;
     document.getElementById("mSunrise").textContent  = astro.sunrise;
     document.getElementById("mSunset").textContent   = astro.sunset;
     document.getElementById("mPrecip").textContent   = `${c.precip_mm} mm`;
     document.getElementById("mCloud").textContent    = `${c.cloud}%`;
     document.getElementById("mWindDir").textContent  = c.wind_dir;
     document.getElementById("mDew").textContent      = `${c.dewpoint_c !== undefined ? c.dewpoint_c : "N/A"} °C`;
   }
   
   /* ─── AQI ─────────────────────────────────────── */
   function populateAQI(aq) {
     const strip = document.getElementById("aqiStrip");
     if (!aq) { strip.classList.add("hidden"); return; }
     const index = aq["us-epa-index"] || 1;
     const labels = ["Good","Moderate","Unhealthy (Sensitive)","Unhealthy","Very Unhealthy","Hazardous"];
     const colors = ["#22c55e","#eab308","#f97316","#ef4444","#a855f7","#7f1d1d"];
     const pct    = Math.min((index / 6) * 100, 100);
   
     document.getElementById("aqiVal").textContent     = labels[index - 1] || "—";
     document.getElementById("aqiText").textContent    = `EPA Index: ${index}`;
     document.getElementById("aqiText").style.color    = colors[index - 1] || "var(--text2)";
     const fill = document.getElementById("aqiBarFill");
     fill.style.width      = pct + "%";
     fill.style.background = colors[index - 1];
   }
   
   /* ─── 7-DAY FORECAST ─────────────────────────── */
   function populateForecast(days) {
     const grid  = document.getElementById("forecastGrid");
     const today = new Date().toDateString();
     grid.innerHTML = days.map((d, i) => {
       const date    = new Date(d.date);
       const isToday = date.toDateString() === today;
       const dayName = isToday ? "Today" : date.toLocaleDateString("en", { weekday: "short" });
       const dateStr = date.toLocaleDateString("en", { month: "short", day: "numeric" });
       const max     = unitCelsius ? d.day.maxtemp_c : d.day.maxtemp_f;
       const min     = unitCelsius ? d.day.mintemp_c : d.day.mintemp_f;
       return `
         <div class="forecast-card ${isToday ? "today" : ""}">
           <span class="fc-day">${dayName}</span>
           <span class="fc-date">${dateStr}</span>
           <img class="fc-icon" src="https:${d.day.condition.icon}" alt="${d.day.condition.text}">
           <div class="fc-temps">
             <span class="fc-max">${max}°</span>
             <span class="fc-min">${min}°</span>
           </div>
           <span class="fc-cond">${d.day.condition.text}</span>
           <span class="fc-rain">💧 ${d.day.daily_chance_of_rain}%</span>
         </div>`;
     }).join("");
   }
   
   /* ─── HOURLY ─────────────────────────────────── */
   function populateHourly(hours) {
     const scroll  = document.getElementById("hourlyScroll");
     const nowHour = new Date().getHours();
     scroll.innerHTML = hours.map(h => {
       const hTime = new Date(h.time).getHours();
       const isNow = hTime === nowHour;
       const temp  = unitCelsius ? h.temp_c : h.temp_f;
       return `
         <div class="hourly-card ${isNow ? "now" : ""}">
           <span class="hc-time">${isNow ? "NOW" : formatHour(hTime)}</span>
           <img class="hc-icon" src="https:${h.condition.icon}" alt="">
           <span class="hc-temp">${temp}°</span>
           <span class="hc-rain">💧 ${h.chance_of_rain}%</span>
           <span class="hc-wind">💨 ${h.wind_kph} km/h</span>
         </div>`;
     }).join("");
     // Scroll to now
     const nowCard = scroll.querySelector(".now");
     if (nowCard) nowCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
   }
   
   /* ─── ANALYTICS ──────────────────────────────── */
   function populateAnalytics(data) {
     const c    = data.current;
     const days = data.forecast.forecastday;
     const panel = document.getElementById("analyticsPanel");
   
     // Smart insights
     const tips = buildInsights(c, days);
   
     // Temp range bar data
     const tempBars = days.map(d => ({
       label: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
       val: unitCelsius ? d.day.avgtemp_c : d.day.avgtemp_f
     }));
     const maxVal = Math.max(...tempBars.map(t => t.val));
   
     const barsHTML = tempBars.map(t => `
       <div class="tc-bar-wrap">
         <div class="tc-bar" style="height:${Math.max(8, (t.val/maxVal)*72)}px; opacity:${0.5 + (t.val/maxVal)*0.5}"></div>
         <span class="tc-label">${t.label}<br>${Math.round(t.val)}°</span>
       </div>`).join("");
   
     // Wind category
     const windCat = windCategory(c.wind_kph);
     const heatIdx = heatIndex(c.temp_c, c.humidity);
   
     panel.innerHTML = `
       <div class="analytics-row">
         <div class="analytics-card">
           <span class="ac-title">Comfort Index</span>
           <span class="ac-value">${heatIdx}°</span>
           <span class="ac-sub">Apparent temperature combining heat and humidity.</span>
           <span class="ac-badge ${heatIdx > 40 ? "danger" : heatIdx > 32 ? "warn" : "good"}">
             ${heatIdx > 40 ? "⚠️ Dangerous" : heatIdx > 32 ? "🌡 Hot" : "✅ Comfortable"}
           </span>
         </div>
         <div class="analytics-card">
           <span class="ac-title">Wind Conditions</span>
           <span class="ac-value">${c.wind_kph}<small style="font-size:20px"> km/h</small></span>
           <span class="ac-sub">${windCat.desc}</span>
           <span class="ac-badge ${windCat.cls}">${windCat.label}</span>
         </div>
       </div>
   
       <div class="analytics-row">
         <div class="analytics-card">
           <span class="ac-title">UV Index</span>
           <span class="ac-value">${c.uv}</span>
           <span class="ac-sub">${uvDesc(c.uv)}</span>
           <span class="ac-badge ${c.uv >= 8 ? "danger" : c.uv >= 3 ? "warn" : "good"}">
             ${uvLabel(c.uv)}
           </span>
         </div>
         <div class="analytics-card">
           <span class="ac-title">7-Day Temp Trend</span>
           <div class="temp-chart">${barsHTML}</div>
         </div>
       </div>
   
       <div class="smart-summary">
         <span class="ss-title">🤖 Smart Weather Insights</span>
         ${tips.map(t => `
           <div class="ss-chip">
             <span class="chip-icon">${t.icon}</span>
             <span>${t.text}</span>
           </div>`).join("")}
       </div>`;
   }
   
   /* ─── SMART INSIGHTS ─────────────────────────── */
   function buildInsights(c, days) {
     const tips = [];
     const temp = c.temp_c;
     const hum  = c.humidity;
     const uv   = c.uv;
     const wind = c.wind_kph;
     const rain = days[0].day.daily_chance_of_rain;
   
     if (temp >= 38) tips.push({ icon: "🔥", text: "Extreme heat alert! Stay indoors between 11 AM–4 PM, drink at least 3 litres of water." });
     else if (temp >= 32) tips.push({ icon: "☀️", text: "Hot day ahead. Wear light clothes, carry water, and use sunscreen SPF 30+." });
     else if (temp <= 5)  tips.push({ icon: "🧥", text: "Very cold outside. Layer up with warm clothing and avoid prolonged exposure." });
     else                 tips.push({ icon: "🌤", text: "Pleasant temperature. Great day for outdoor activities." });
   
     if (rain >= 70)      tips.push({ icon: "🌧", text: `High chance of rain (${rain}%). Carry an umbrella and avoid low-lying areas.` });
     else if (rain >= 40) tips.push({ icon: "🌦", text: `Moderate rain probability (${rain}%). Keep an umbrella handy.` });
     else                 tips.push({ icon: "✅", text: `Low rain chance (${rain}%). Skies are mostly clear today.` });
   
     if (uv >= 8)         tips.push({ icon: "🕶", text: "Very high UV! Apply SPF 50+ sunscreen every 2 hours, wear sunglasses and a hat." });
     else if (uv >= 3)    tips.push({ icon: "🧴", text: "Moderate UV levels. Apply sunscreen before going out." });
   
     if (hum >= 80)       tips.push({ icon: "💦", text: "Very high humidity. You may feel sweaty and uncomfortable outdoors." });
     else if (hum <= 25)  tips.push({ icon: "🌵", text: "Air is dry. Stay hydrated and use a moisturizer to prevent skin dryness." });
   
     if (wind >= 60)      tips.push({ icon: "⚠️", text: "Strong winds detected. Secure loose objects and avoid exposed areas." });
     else if (wind >= 30) tips.push({ icon: "💨", text: "Breezy conditions. Good for ventilation but keep hair and papers secure." });
   
     // Tomorrow preview
     const tmr = days[1];
     if (tmr) {
       const tmrTemp = tmr.day.avgtemp_c;
       const diff    = Math.round(tmrTemp - temp);
       if (diff >= 3)       tips.push({ icon: "📈", text: `Temperature will rise by ~${diff}°C tomorrow (${tmrTemp}°C avg). Plan accordingly.` });
       else if (diff <= -3) tips.push({ icon: "📉", text: `Temperature will drop by ~${Math.abs(diff)}°C tomorrow (${tmrTemp}°C avg). Dress warmer.` });
     }
   
     return tips;
   }
   
   /* ─── SAVE / LOAD CITIES ─────────────────────── */
   function saveCurrentCity() {
     if (!currentData) return;
     const name = currentData.location.name;
     if (savedCities.includes(name)) return;
     savedCities.push(name);
     savedWeather[name] = {
       temp:   currentData.current.temp_c,
       icon:   currentData.current.condition.icon,
       cond:   currentData.current.condition.text
     };
     localStorage.setItem("nimbus_saved", JSON.stringify(savedCities));
     localStorage.setItem("nimbus_savedWeather", JSON.stringify(savedWeather));
     renderSavedCities();
   }
   
   function removeSavedCity(city, e) {
     e.stopPropagation();
     savedCities = savedCities.filter(c => c !== city);
     delete savedWeather[city];
     localStorage.setItem("nimbus_saved", JSON.stringify(savedCities));
     localStorage.setItem("nimbus_savedWeather", JSON.stringify(savedWeather));
     renderSavedCities();
   }
   
   function renderSavedCities() {
     const grid = document.getElementById("savedCitiesGrid");
     if (!savedCities.length) {
       grid.innerHTML = `<div class="placeholder-msg">No saved cities yet. Search a city and hit "Save Current City".</div>`;
       return;
     }
     grid.innerHTML = savedCities.map(city => {
       const w = savedWeather[city] || {};
       return `
         <div class="saved-city-card" onclick="getWeather('${city}')">
           <button class="sc-remove" onclick="removeSavedCity('${city}', event)" title="Remove">✕</button>
           <span class="sc-name">${city}</span>
           ${w.icon ? `<img src="https:${w.icon}" width="40" alt="">` : ""}
           <span class="sc-temp">${w.temp !== undefined ? w.temp + "°C" : "—"}</span>
           <span class="sc-cond">${w.cond || ""}</span>
         </div>`;
     }).join("");
   }
   
   /* ─── HELPERS ────────────────────────────────── */
   function formatHour(h) {
     const suffix = h >= 12 ? "PM" : "AM";
     const display = h % 12 === 0 ? 12 : h % 12;
     return `${display} ${suffix}`;
   }
   
   function uvLabel(uv) {
     if (uv >= 11) return "Extreme";
     if (uv >= 8)  return "Very High";
     if (uv >= 6)  return "High";
     if (uv >= 3)  return "Moderate";
     return "Low";
   }
   
   function uvDesc(uv) {
     if (uv >= 11) return "Outdoor exposure must be avoided. Strong protection required.";
     if (uv >= 8)  return "Avoid being outside during midday hours. Wear full protection.";
     if (uv >= 6)  return "Apply SPF 30+ sunscreen, wear a hat and sunglasses.";
     if (uv >= 3)  return "Sun protection is recommended during midday.";
     return "No protection needed for most people.";
   }
   
   function windCategory(kph) {
     if (kph >= 90)  return { label: "⚠️ Dangerous", cls: "danger", desc: "Potential for damage to structures and trees." };
     if (kph >= 60)  return { label: "🌪 Strong",    cls: "warn",   desc: "Strong winds. Secure loose outdoor items." };
     if (kph >= 30)  return { label: "💨 Breezy",    cls: "warn",   desc: "Noticeably breezy; flags extended fully." };
     if (kph >= 12)  return { label: "🍃 Gentle",    cls: "good",   desc: "Light breeze; good for outdoor activities." };
     return { label: "😌 Calm", cls: "good", desc: "Near-calm conditions. Very comfortable outdoors." };
   }
   
   function heatIndex(tempC, humidity) {
     // Simplified Steadman formula
     const T = tempC;
     const H = humidity;
     const HI = -8.78469475556
       + 1.61139411     * T
       + 2.33854883889  * H
       - 0.14611605     * T * H
       - 0.012308094    * T * T
       - 0.0164248277778 * H * H
       + 0.002211732    * T * T * H
       + 0.00072546     * T * H * H
       - 0.000003582    * T * T * H * H;
     return Math.round(HI);
   }
   
   /* ─── UI STATE ────────────────────────────────── */
   function showLoading(v) {
     document.getElementById("loadingOverlay").classList.toggle("hidden", !v);
   }
   function showError(msg) {
     document.getElementById("errorMsg").textContent = "⚠️ " + msg;
     document.getElementById("errorBanner").classList.remove("hidden");
   }
   function closeError() {
     document.getElementById("errorBanner").classList.add("hidden");
   }

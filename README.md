<div align="center">

# 📍 PinIndia

### India's Complete Postal PIN Code Explorer

*Search · Browse · Visualise · Export — all 150,000+ Indian post offices in one place*

---

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

---

## 📖 About

**PinIndia** is a full-stack web application built to explore India's complete postal PIN code database — covering all states, districts, taluks, and over **150,000 post offices** nationwide.

Whether you need to look up a specific 6-digit code, filter pincodes by geography, or visualise state-level distributions through charts, PinIndia makes it fast and intuitive. The REST API is also independently usable for any application that needs Indian PIN code data.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Pincode Lookup** | Search by 6-digit PIN, office name, district, or state with instant results and recent-search history |
| 🗺️ **Explore** | Browse all pincodes with multi-level filters — state → district → taluk — with pagination |
| 📊 **Dashboard** | Stats cards, state-wise bar charts, and delivery vs non-delivery pie charts |
| 📐 **Distance Calculator** | Calculate straight-line distance between any two Indian pincodes |
| ⬇️ **CSV Export** | Download filtered pincode data directly as a CSV file |
| 📱 **PWA Ready** | Installable as a Progressive Web App via Vite PWA + Workbox |
| ⚡ **Debounced Search** | Full-text search across office name, district, state, taluk, and pincode number |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **Vite 5** — fast, modern UI
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — page transitions and animations
- **Recharts** — bar and pie charts on the dashboard
- **react-simple-maps** — geographic map visualisation
- **React Router v6** — client-side routing
- **Axios** — API communication with debounced search via custom hook

### Backend
- **Node.js** + **Express** — REST API server
- **MongoDB** + **Mongoose** — document database with text indexes for fast search
- **json2csv** — server-side CSV generation for the export endpoint
- **dotenv** — environment variable management
- **nodemon** — hot-reloading for development

---

## 🗂️ Project Structure

```
PinIndia/
├── backend/
│   ├── models/
│   │   └── Pincode.js          # Mongoose schema (pincode, office, district, state…)
│   ├── routes/
│   │   ├── pincodes.js         # Lookup, search, paginated browse
│   │   ├── states.js           # States → districts → taluks hierarchy
│   │   ├── stats.js            # Aggregation queries for dashboard
│   │   └── export.js           # CSV export endpoint
│   ├── middleware/
│   │   └── errorHandler.js
│   └── server.js               # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── PincodeLookup.jsx    # Search page
    │   │   ├── Explore.jsx          # Browse + filter page
    │   │   ├── Dashboard.jsx        # Charts & stats
    │   │   ├── DistanceCalculator.jsx
    │   │   └── About.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── DataTable.jsx
    │   │   ├── FilterPanel.jsx
    │   │   ├── StatsCard.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── Skeleton.jsx / SkeletonCard.jsx / SkeletonTable.jsx
    │   │   └── PageTransition.jsx
    │   ├── hooks/
    │   │   └── useDebounce.js
    │   ├── api.js               # Axios client + all API functions
    │   └── main.jsx
    ├── index.html
    └── vite.config.js
```

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

### Pincodes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pincode/:pincode` | Fetch all records for a specific 6-digit PIN |
| `GET` | `/api/pincodes` | Paginated list — supports `?state=`, `?district=`, `?taluk=`, `?page=`, `?limit=` |
| `GET` | `/api/search?q=` | Full-text search across office name, district, state, taluk, and pincode |

### Geography

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/states` | List of all distinct states |
| `GET` | `/api/states/:state/districts` | All districts within a state |
| `GET` | `/api/states/:state/districts/:district/taluks` | All taluks within a district |

### Stats & Export

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Total pincodes, states, delivery & non-delivery office counts |
| `GET` | `/api/stats/state-distribution` | Per-state pincode counts for bar chart |
| `GET` | `/api/stats/delivery-distribution` | Delivery vs non-delivery split for pie chart |
| `GET` | `/api/export` | Download filtered results as a `.csv` file |

### Example Response — `/api/pincode/380001`

```json
[
  {
    "pincode": 380001,
    "officeName": "Ahmedabad GPO",
    "officeType": "HO",
    "deliveryStatus": "Delivery",
    "divisionName": "Ahmedabad City",
    "regionName": "Ahmedabad",
    "circleName": "Gujarat",
    "taluk": "Ahmedabad",
    "districtName": "AHMEDABAD",
    "stateName": "GUJARAT"
  }
]
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/DhruvOzha85/PinIndia.git
cd PinIndia
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend server:

```bash
npm run dev        # development (nodemon)
# or
npm start          # production
```

The API will be running at `http://localhost:5000`.

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
# Frontend
cd frontend
npm run build      # outputs to frontend/dist/

# Backend — run with a process manager like pm2
npm start
```

---

## 🗃️ Data Model

The `Pincode` collection in MongoDB stores one document per post office:

| Field | Type | Description |
|---|---|---|
| `pincode` | Number | 6-digit postal code |
| `officeName` | String | Name of the post office |
| `officeType` | String | `HO` (Head), `SO` (Sub), `BO` (Branch) |
| `deliveryStatus` | String | `Delivery` or `Non-Delivery` |
| `divisionName` | String | Postal division |
| `regionName` | String | Postal region |
| `circleName` | String | Postal circle (usually state-level) |
| `taluk` | String | Sub-district / taluka |
| `districtName` | String | District |
| `stateName` | String | State |
| `telephone` | String | Post office telephone number |
| `relatedSubOffice` | String | Parent sub-office |
| `relatedHeadOffice` | String | Parent head office |

A compound text index is applied to `officeName`, `districtName`, `stateName`, and `taluk` for performant full-text search.

---

## 📦 Scripts

### Backend

| Command | Description |
|---|---|
| `npm start` | Run server with Node.js |
| `npm run dev` | Run server with nodemon (hot reload) |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/my-feature`
3. Commit your changes — `git commit -m 'Add my feature'`
4. Push to the branch — `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [DhruvOzha85](https://github.com/DhruvOzha85)

*⭐ Star this repo if you found it useful!*

</div>

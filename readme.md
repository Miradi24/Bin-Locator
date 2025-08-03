# 🗑️ Bin Locator

Bin Locator is a mobile application designed to help users locate the nearest bin for waste disposal. Through the use of google maps a user can find bins based on the their current location, ensuring efficient waste management.

## 🧰 Technologies

-   **Frontend**: React Native, Expo
-   **Backend**: Express JS
-   **Database**: Mongo DB

## 😎 App Features

-   Create user accounts
-   Create markers on the map for bins
-   View nearby bins on the map
-   Get directions to a bin

---

## 🛠️ Installation & Setup

### ⚙️ Environment Variables

Create **.env** file in **backend/** and set the following variables

```
PORT=
NODE_ENV=
DATABASE_URL=
COOKIE_SECRET=
```

Create **.env** file in **frontend/** and set the following variables

```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_API_URL=
```

### 🔧 Set up the backend

```
cd backend
npm install
npm run dev
```

### 💻 Set up the frontend

```
cd frontend
npm install
npx expo start
```

## 🧪 Running Tests

### Backend Tests

```
cd backend
npm run test
```

### Frontend Tests

```
cd frontend
npm run test
```

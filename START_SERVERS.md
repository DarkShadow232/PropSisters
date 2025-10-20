# 🚀 How to Start Both Servers

## Problem: White/Blank Page

If you see a **blank white page**, it means one or both servers are not running.

---

## ✅ Solution: Start Both Servers

You need **TWO servers running** at the same time:

### Server 1: Admin Console (Backend)
**Port:** 3000  
**Purpose:** Serves property data from MongoDB

```bash
# Terminal 1:
cd admin-console
npm start
```

**Wait for:** `✓ MongoDB Connected` and `Server running on port 3000`

---

### Server 2: Frontend (React/Vite)
**Port:** 8081  
**Purpose:** Shows the website

```bash
# Terminal 2 (new terminal):
npm run dev
```

**Wait for:** `VITE v... ready in ...ms` and `Local: http://localhost:8081/`

---

## 🎯 Both Servers are NOW RUNNING!

✅ **Admin Console:** Running on port 3000  
✅ **Frontend:** Running on port 8081  

---

## 🔄 What to Do Now:

### Refresh Your Browser!

1. Go to your browser
2. Press **`Ctrl + R`** or click the refresh button
3. The page should now load!

Or visit: **http://localhost:8081/rentals**

---

## ✨ Expected Result:

After refreshing, you should see:
- ✅ Browse Rentals page with 10 property cards
- ✅ Can click on properties to see details
- ✅ All images and data load from database

---

## 🧪 Quick Test:

### Test 1: Check Frontend
Open: **http://localhost:8081/rentals**
- Should show 10 properties

### Test 2: Check Backend API
Open: **http://localhost:3000/api/properties**
- Should show JSON data

### Test 3: Click a Property
Click any property card → Should show full details page (not blank!)

---

## ⚠️ If You See Blank Page Again:

### Check if both servers are running:

```bash
# Check port 3000 (Admin Console)
netstat -ano | findstr ":3000"

# Check port 8081 (Frontend)  
netstat -ano | findstr ":8081"
```

Both should show "LISTENING"

### Restart if needed:

**Terminal 1:**
```bash
cd admin-console
npm start
```

**Terminal 2:**
```bash
npm run dev
```

---

## 📊 Server Status:

| Server | Port | Status | URL |
|--------|------|--------|-----|
| Admin Console | 3000 | ✅ Running | http://localhost:3000 |
| Frontend | 8081 | ✅ Running | http://localhost:8081 |

---

## 🎊 Everything is Ready!

Both servers are now running. Just **refresh your browser** and you'll see the properties!

**Visit:** http://localhost:8081/rentals

---

## 💡 Pro Tip:

Keep both terminal windows open while working:
- **Terminal 1:** Admin console (don't close)
- **Terminal 2:** Frontend dev server (don't close)

If you close them, the servers stop and you'll see a blank page again.


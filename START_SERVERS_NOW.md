# 🚀 Start Both Servers - Step by Step

## ⚠️ IMPORTANT: You need TWO terminal windows!

---

## 📋 **Terminal 1 - Start Backend Server**

### Step 1: Open Terminal #1
1. Open a NEW terminal window in VS Code
2. Run these commands:

```bash
cd admin-console
npm start
```

### ✅ Success looks like:
```
MongoDB Connected
Server running on http://localhost:3000
```

**Keep this terminal OPEN and RUNNING!**

---

## 📋 **Terminal 2 - Start Frontend Server**

### Step 1: Open Terminal #2
1. Open ANOTHER NEW terminal window in VS Code
2. Run these commands:

```bash
npm run dev
```

### ✅ Success looks like:
```
VITE ready in XXX ms
Local: http://localhost:8081
```

**Keep this terminal OPEN and RUNNING too!**

---

## 🎯 After Both Servers Are Running:

### Go to your browser:
```
http://localhost:8081/rentals
```

### Click on any property, the link should work now!

---

## ❌ Common Mistakes:

1. **Running commands from wrong directory**
   - Backend needs: `cd admin-console` FIRST
   - Frontend runs from: project root

2. **Closing terminal windows**
   - Both terminals must STAY OPEN
   - Don't close them while testing

3. **Not waiting for servers to start**
   - Wait for "Server running" message
   - Wait for "VITE ready" message

---

## 📸 What You Should See:

### Terminal 1 (Backend):
```
MongoDB Connected
Server running on http://localhost:3000
```

### Terminal 2 (Frontend):
```
VITE vX.X.X ready in XXX ms
➜  Local:   http://localhost:8081/
```

---

## 🆘 Still Not Working?

Run this command to see what's running:
```bash
netstat -ano | findstr ":3000 :8081"
```

Should show both ports (3000 and 8081) as LISTENING.

---

# ✨ START NOW - FOLLOW THESE STEPS EXACTLY!


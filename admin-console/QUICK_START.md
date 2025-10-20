# Quick Start Guide

Get your Admin Console up and running in 3 minutes!

## 📦 Step 1: Install Dependencies

```bash
cd admin-console
npm install
```

## 🗄️ Step 2: Setup MongoDB

**Option A - Local MongoDB** (Easiest for development):
```bash
# Install MongoDB locally, then it runs on default port
# No configuration needed - default connection string works!
```

**Option B - MongoDB Atlas** (Cloud):
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `.env` with your connection string

## ⚙️ Step 3: Configure Environment

Create `.env` file:
```bash
cp env.example .env
```

Edit `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rental-admin
SESSION_SECRET=change-this-to-a-random-secret-string
```

## 👤 Step 4: Create Admin Account

```bash
npm run seed
```

Follow the prompts:
- Enter your name
- Enter your email
- Enter a password (min 6 characters)

**Save these credentials!**

## 🚀 Step 5: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## 🎉 Step 6: Login

1. Open browser: **http://localhost:3000/auth/login**
2. Login with the credentials from Step 4
3. Start managing your rental platform!

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB running (local or Atlas)
- [ ] `.env` file configured
- [ ] Admin account created (`npm run seed`)
- [ ] Server started (`npm start`)
- [ ] Logged in successfully

---

## 🆘 Common Issues

### "Cannot connect to MongoDB"
- Make sure MongoDB is running locally, or
- Check your MongoDB Atlas connection string in `.env`

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### "Images not uploading"
- Check `public/uploads/rentals/` directory exists
- Verify the directory has write permissions

---

## 📚 What's Next?

- Read the full [README.md](./README.md) for detailed documentation
- Explore the dashboard at http://localhost:3000
- Add your first property
- Manage users and bookings

**Need help?** Check the README.md file for detailed documentation!

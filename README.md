# SilentQueue – Real-Time Queue Management System

## Project Overview

SilentQueue is a **smart, real-time queue management platform** designed to save time for both users and service providers. It allows visitors to check queue status, join queues remotely, and estimate wait times. Admins can manage multiple queues effortlessly with live updates.  

Perfect for **offices, hospitals, canteens, banks, and service counters**, SilentQueue minimizes waiting, enhances transparency, and provides a **modern, Google-tech powered experience**.  

**Live Demo:** *(Add your hosting link here)*  
**GitHub Repository:** https://github.com/YOUR_USERNAME/silentqueue

---

## Features

- **Live Queue Status:** Users see real-time updates of queue length and estimated wait time.
- **Join Queues Online:** Scan a QR code or click a link to join a queue instantly.
- **Dynamic QR Codes:** Every queue generates a unique QR for easy access.
- **Admin Dashboard:** Manage multiple queues, serve the next person, pause/resume queues, or delete queues.
- **Secure Admin Login:** Admin dashboard is password-protected for security.
- **Average Wait Time Calculation:** Helps users plan their visit more efficiently.
- **Responsive Design:** Works on mobile and desktop seamlessly.
- **Push Notifications (Future):** Can notify users when their turn is approaching.

---

## Technology Stack

SilentQueue is built using **modern, hackathon-level technologies**:

- **Frontend:** React + TypeScript + Tailwind CSS  
- **UI Components:** shadcn-ui for professional and responsive UI  
- **Backend:** Firebase Realtime Database for real-time data sync  
- **Hosting:** Vercel Hosting (optional, instant deployment)  
- **QR Code Integration:** `qrcode.react` to generate dynamic QR codes  
- **State Management:** React hooks for simplicity and performance  

---

## How It Works

1. **Admin Creates a Queue:** Admin sets the counter name and average service time.  
2. **Queue Generates a Link & QR Code:** Users can join via link or scan QR code.  
3. **Users Join & Track Their Position:** Position updates in real-time with estimated wait.  
4. **Admins Manage Queues:** Serve next user, pause/resume, or delete queues instantly.  
5. **Live Updates:** All users see changes in queue status immediately thanks to Firebase.  

---

## Getting Started Locally

**Prerequisites:** Node.js & npm installed

```bash
# Step 1: Clone the repository
git clone https://github.com/YOUR_USERNAME/silentqueue.git

# Step 2: Navigate to the project folder


# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev

And you are done !

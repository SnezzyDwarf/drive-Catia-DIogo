# Wedding Drive

A private photo and video sharing platform created for weddings.

The goal of this project is to provide wedding guests with a simple and elegant way to access, upload and share their memories from the event, while using Google Drive as the main storage solution.

## Features

- Private access protected by a password
- Photo gallery
- Video gallery
- Upload photos and videos
- Responsive design for mobile and desktop
- Google Drive integration
- Import files from the guest's Google Drive
- Centralized storage for all wedding media

## Tech Stack

### Frontend

- React
- Vite
- CSS Modules

### Backend

- Node.js
- Express

### APIs & Services

- Google Drive API
- Google OAuth

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── layout/
│   ├── ui/
│   └── sections/
├── pages/
├── hooks/
├── services/
├── utils/
└── App.jsx
```

## How It Works

```text
Guest
  ↓
Wedding Website
  ↓
Password
  ↓
Gallery
  ↓
Upload / Import
  ↓
Backend
  ↓
Google Drive
```

The website acts as the user interface while Google Drive is used as the storage layer for photos and videos.

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd wedding-drive
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Environment Variables

When the backend and Google integration are added, environment variables will be required for credentials and configuration.

Example:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_DRIVE_FOLDER_ID=
```

Do not commit sensitive credentials to the repository.

## Roadmap

- [x] Initial React project
- [ ] Landing page
- [ ] Password protected area
- [ ] Photo gallery
- [ ] Video gallery
- [ ] Upload interface
- [ ] Google Drive integration
- [ ] Google OAuth
- [ ] Import files from Google Drive
- [ ] Backend API
- [ ] Admin area
- [ ] Comments
- [ ] Likes
- [ ] Album management

## Purpose

This project is also being developed as a learning project to explore:

- React application architecture
- API integration
- Node.js and Express
- Authentication
- OAuth
- File uploads
- Google Drive API
- Backend development

## Status

**In development**

The initial focus is building the frontend and user experience before implementing the backend and Google Drive integration.

## License

This project is for personal and educational purposes.

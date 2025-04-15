# Dance Class Website

This is a basic website developed with express and mustache for university coursework.

## Features
### Unauthenticaed users
- Navigate and browse active courses and classes
- Browse about page
- Register to courses/classes & receive a confirmation/cancellation email
- Sign up/sign in/reset password
### Authenticated organisers
All the above and:
- Create a workshop or recurring course with configurable pre-populated classes
- Manage and modify all courses and classes
- View and remove all attendees to owned courses and classes
- Add and remove organisers to courses
### Authenticated admins
All the above and
- Approve newly registered unapproved organisers

## Installation

### Clone the repository
git clone https://github.com/Eveeeon/WAD2DanceClassWebsite.git
cd WAD2DanceClassWebsite

### Pre-requesites
Create a gmail account and enable and create an app password, this will enable the emailing feature to work, use the app password in the following .env file
Follow the link:
https://myaccount.google.com/apppasswords

### Configuring
Create a .env file in the root (above src) and populate the following values inside:

JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password_here
BASE_URL=http://localhost:3000
NODE_ENV=development

### Optional - populate with test data before running
npm run dummyData

### Running
npm install
npm run src/index.js

### Running for development (for automatic changes)
npm run dev
npm run src/index.js

## License
ISC
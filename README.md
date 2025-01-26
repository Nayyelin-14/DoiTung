# Doi Tung E-Learning Platform

The **Doi Tung E-Learning Platform** is an innovative web application designed to promote education, cultural preservation, and community engagement in the Doi Tung region. This platform integrates local culture with modern learning tools to provide an enriching and accessible educational experience for users of all ages.

## Key Features

### User Side

- **User Authentication**:
  - Users can log in using **OAuth Google** or sign up with their **email**.
  - Upon registering for the first time, users will receive a **verification email** to confirm their email address.
  - After verification, users can **log in** to the platform.

- **Course Enrollment**:
  - Users can **search for courses** by input or category.
  - Courses can be filtered by **category**, **input**, and **type** (e.g., popular, all courses).
  - Before enrolling, users can view a **course overview** to better understand the content.
  - After enrolling in a course, users can **start learning** the course.

- **Profile Management**:
  - Users can **check their profile**.
  - Users can track their **progress** in courses they've enrolled in.
  - **Certificates** of completed courses are available for viewing.
  - **Ongoing courses** that users are still learning are listed.
  - Users can **update their username and password**.

- **Two-Step Verification**:
  - Users can enable **two-step verification** for enhanced security.
  - Upon login, users will need to enter an **OTP** (One-Time Password) sent to their email before they can access their account.

### Admin Side

  ## Admin Dashboard

The **Admin Dashboard** that allows to manage users and courses effectively. It provides a centralized interface for admins to view and perform actions related to user management, course management, and other administrative tasks.

### Key Features of Admin Dashboard:

1. **User Management**:
   - Admins can view a list of all registered users.
   - Admins can search for users by name, email, or registration status.
   - Admins can activate or deactivate users' accounts.
   - Admins can monitor users' learning progress, such as courses in progress, certificates earned, and learning history.

2. **Course Management**:
   - Admins can view a list of all courses available on the platform.
   - Admins can search for courses by name, category, or status (draft/completed).
   - Admins can add new courses, edit existing courses, and delete courses that are no longer relevant.
   - Admins can upload and manage course images and videos, storing them in **Cloudinary**.
   - Admins can update course details such as course title, description, instructors, and pricing.
   - Admins can monitor the enrollment of students in each course and view progress statistics.
   
3. **Certificates**:
  - Admin can issue **certificates** for users upon course completion.


## Tech Stack

- **Frontend**: React.js, Vite, TailwindCSS, MUI, Redux
- **Backend**: Node.js, Express.js, MySQL, Drizzle ORM, JWT Authentication, Two-Step Verification (OTP)
- **Database**: MySQL
- **Email Service**: Nodemailer, Resend, EmailJS
- **Security**: HTTPS, Encrypted Passwords , jwt token

## Media Storage

### Cloudinary Integration

In this project, all **learning videos**, **images**, and **user profile images** are stored in **Cloudinary**. Cloudinary is a cloud-based service for managing and delivering images, videos, and other media assets.


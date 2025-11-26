<div align="center">

# 🎓 Learning Support System (LSS) Frontend

**A comprehensive, multi-role educational platform connecting students, teachers, and administrators**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.26.2-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.7.7-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Features by Role](#-key-features-by-role)
- [API Integration](#-api-integration)
- [State Management](#-state-management)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Learning Support System (LSS)** is a full-featured educational platform designed to facilitate seamless interaction between students, teachers, administrators, and staff. The platform provides comprehensive class management, application processing, payment integration, feedback systems, and real-time notifications.

### 🌟 Key Highlights

- 🔐 **Multi-role Authentication System** - Secure authentication for Students, Teachers, Admins, and Staff with OTP verification
- 📚 **Comprehensive Class Management** - Create, manage, schedule, and track classes with real-time status updates
- 💰 **Integrated Payment System** - VNPay gateway integration for seamless transactions and wallet management
- 📝 **Application Management** - Complete workflow for registration, withdrawal, and other application types
- 💬 **Feedback & Rating System** - Collect, manage, and display student feedback with detailed analytics
- 📱 **Responsive Design** - Modern, mobile-first UI with dark/light theme support
- 🔔 **Real-time Notifications** - Stay updated with important announcements and system notifications
- 📊 **Analytics Dashboard** - Comprehensive statistics and reporting for administrators
- 📄 **Document Management** - Upload, organize, and access class materials and documents
- 📰 **News Management** - Create and manage news articles and announcements

---

## ✨ Features

### 🎨 User Interface & Design
- ✨ **Modern, Responsive Design** - Built with Tailwind CSS for beautiful, responsive layouts
- 🌓 **Dark/Light Theme Toggle** - System-aware theme switching with persistent preferences
- 📱 **Mobile-First Approach** - Optimized for all device sizes
- 🎭 **Beautiful UI Components** - Radix UI primitives for accessible, customizable components
- 🎯 **Intuitive Navigation** - Collapsible sidebar navigation with role-based menus
- 🎨 **Icon Library** - Lucide React icons throughout the application
- 🎬 **Smooth Animations** - Tailwind CSS Animate for polished transitions

### 🔐 Authentication & Security
- 🔑 **Secure Login/Logout** - Session-based authentication with token management
- 📧 **Email/Phone Verification** - OTP-based verification for registration and password reset
- 🔒 **Password Reset Flow** - Complete forgot password workflow with OTP verification
- 🛡️ **Protected Routes** - Role-based route protection using ProtectedRoute component
- 💾 **Session Management** - Secure session and local storage handling
- 🔐 **Role-Based Access Control** - Different access levels for Students, Teachers, Admins, and Staff

### 👥 Multi-Role System

#### 👨‍🎓 **Student Features**

**Class Management:**
- 📖 Browse all available classes with filtering and search
- 🔍 View detailed class information (schedule, teacher, price, description)
- 📚 View enrolled classes in "My Classes"
- 📄 Access class documents and materials
- 📊 View class schedules and timetables
- ⭐ Rate and provide feedback for completed classes

**Wallet & Payments:**
- 💳 View wallet balance
- 💰 Recharge wallet using VNPay payment gateway
- 📊 View complete transaction history
- 💸 Track deposits and withdrawals
- 📋 View order history and details

**Applications:**
- 📝 Submit registration applications
- 💸 Submit withdrawal applications
- 📄 Submit other types of applications
- 📋 View application status and history
- 📧 Receive application notifications

**Profile & Settings:**
- 👤 Manage personal profile
- 📧 Update contact information
- 🔔 View and manage notifications
- 📰 Read news and announcements
- 📄 Access personal documents

#### 👨‍🏫 **Teacher Features**

**Class Management:**
- 📚 Create new classes with images and detailed information
- ✏️ Edit existing class details
- 📅 Update class schedules and timings
- 📍 Update class locations
- 👥 View enrolled student lists
- ✅ Manage class status (Active, Ongoing, Completed, Cancelled)
- ❌ Handle class cancellation requests
- 📊 View class statistics and analytics

**Schedule Management:**
- 📅 Create and update teaching schedules
- ⏰ Manage time slots
- 📋 View detailed timetable
- 🔄 Update schedule availability

**Applications:**
- 📝 Submit teacher applications (Register, Withdraw, Other)
- 📋 View application status
- 📧 Receive application notifications

**Financial:**
- 💰 View earnings and wallet balance
- 📊 Track payment history
- 💸 Submit withdrawal requests
- 📈 View financial statistics

**Profile:**
- 👤 Manage teacher profile
- 📝 Update teaching information
- ⭐ View ratings and feedback
- 📊 View teaching statistics

#### 👨‍💼 **Admin Features**

**User Management:**
- 👥 **List Users** - View all registered users with filtering and search
- 🎓 **List Teachers** - Manage all teacher accounts
- ➕ **Create Staff** - Register new staff members
- ✅ **Activate/Deactivate Users** - Control user account status
- 📊 **User Statistics** - View user counts by role

**Class Management:**
- 📚 **View All Classes** - Comprehensive class overview
- 📊 **Class Statistics** - Analytics by status and month
- ✅ **Class Oversight** - Monitor class status and progress
- 🔍 **Class Search & Filter** - Advanced filtering options
- 📈 **Class Analytics** - Detailed reports and charts

**Application Management:**
- 📋 **Registration Applications** - Review and approve student registrations
- 💸 **Withdrawal Applications** - Process withdrawal requests
- 📄 **Other Applications** - Handle miscellaneous applications
- ✅ **Approve/Reject Applications** - Complete application workflow
- 📧 **Application Notifications** - Send email notifications
- 🔄 **Application Assignment** - Assign applications to staff

**System Configuration:**
- ⚙️ **Edit Parameters** - Configure system settings
- 📊 **Dashboard Analytics** - View comprehensive statistics
- 📈 **Revenue Tracking** - Monitor financial metrics
- 📉 **Class Status Reports** - Detailed status breakdowns

**Content Management:**
- 📰 **News Management** - Create, edit, and publish news articles
- 📄 **Document Management** - Oversee system documents
- 🎓 **Category Management** - Manage course categories

#### 👨‍💻 **Staff Features**

**Application Processing:**
- 📋 View assigned applications
- ✅ Process and approve applications
- ❌ Reject applications with reasons
- 📧 Send email notifications
- 📊 View application statistics

**Dashboard:**
- 📈 Overview of assigned tasks
- 📊 Application metrics
- 🔔 Notification management

### 💰 Payment & Wallet System
- 💳 **VNPay Integration** - Secure payment gateway for wallet recharge
- 💵 **Wallet Balance Management** - Real-time balance tracking
- 📊 **Transaction History** - Complete history of all transactions
- 💸 **Withdrawal Requests** - Submit and track withdrawal requests
- 💰 **Recharge Functionality** - Multiple payment methods
- 📈 **Financial Analytics** - Track deposits, withdrawals, and earnings
- 🔔 **Payment Notifications** - Real-time payment status updates

### 📚 Class Management System
- 🎓 **Create Classes** - Full class creation with images, descriptions, and schedules
- ✏️ **Edit Classes** - Update class information and details
- 📅 **Schedule Management** - Create and update class schedules
- 📍 **Location Management** - Update class locations
- 👥 **Student Enrollment** - Track enrolled students per class
- ✅ **Status Management** - Active, Ongoing, Completed, Cancelled statuses
- 📄 **Document Management** - Upload and manage class documents
- 📊 **Class Analytics** - View statistics and performance metrics
- 🔍 **Search & Filter** - Advanced filtering by category, teacher, status
- 📈 **Class Reports** - Monthly and yearly class statistics

### 📝 Application System
- 📋 **Registration Applications** - Student class registration requests
- 💸 **Withdrawal Applications** - Withdrawal requests with approval workflow
- 📄 **Other Applications** - Miscellaneous application types
- ✅ **Approval Workflow** - Multi-step approval process
- ❌ **Rejection Handling** - Reject applications with detailed reasons
- 📧 **Email Notifications** - Automated email notifications
- 📊 **Application Tracking** - Track application status and history
- 🔄 **Application Assignment** - Assign applications to staff members
- 📈 **Application Analytics** - Statistics and reporting

### ⭐ Feedback & Rating System
- ⭐ **Rating System** - Rate classes and teachers
- 💬 **Feedback Forms** - Detailed feedback collection
- 📊 **Feedback Analytics** - View feedback statistics
- 📈 **Average Ratings** - Calculate and display average ratings
- 📋 **Feedback History** - Track submitted feedback
- ❓ **Question Management** - Dynamic feedback questions
- 📄 **Feedback Details** - View detailed feedback information

### 📄 Document Management
- 📤 **Upload Documents** - Upload class materials and files
- 📝 **Edit Documents** - Update document information
- 📄 **View Documents** - Access documents with PDF viewer
- 🗑️ **Delete Documents** - Remove outdated documents
- 📚 **Document Organization** - Organize by class and category
- 🔍 **Document Search** - Search and filter documents

### 📰 News & Notifications
- 📰 **News Management** - Create, edit, and publish news articles
- 📄 **News Details** - View detailed news articles
- 🔔 **Notifications** - Real-time notification system
- ✅ **Notification Status** - Mark notifications as read/unread
- 🗑️ **Delete Notifications** - Manage notification list
- 📊 **Notification Analytics** - Track notification engagement

### 📊 Analytics & Reporting
- 📈 **Dashboard Statistics** - Comprehensive overview metrics
- 👥 **User Analytics** - User counts by role
- 📚 **Class Analytics** - Class statistics by status and month
- 💰 **Financial Analytics** - Revenue and transaction reports
- 📊 **Order Analytics** - Order statistics and details
- 📈 **Monthly Reports** - Detailed monthly breakdowns
- 📉 **Status Reports** - Class status distribution
- 📊 **Charts & Graphs** - Visual data representation with Recharts

### 🎨 Theme & Customization
- 🌓 **Dark Mode** - Full dark theme support
- ☀️ **Light Mode** - Clean light theme
- 🖥️ **System Theme** - Auto-detect system preferences
- 💾 **Theme Persistence** - Save theme preferences
- 🎨 **Customizable UI** - Tailwind CSS for easy customization

---

## 🛠️ Tech Stack

### **Frontend Framework**
- ⚛️ **React 18.3.1** - Modern UI library with hooks and context
- ⚡ **Vite 5.4.1** - Next-generation build tool with HMR
- 🎯 **React Router DOM 6.26.2** - Client-side routing and navigation

### **Styling & UI**
- 🎨 **Tailwind CSS 3.4.11** - Utility-first CSS framework
- 🧩 **Radix UI** - Accessible component primitives
  - Avatar, Checkbox, Dialog, Dropdown Menu
  - Popover, Progress, Radio Group, Scroll Area
  - Select, Separator, Slider, Switch, Tabs
- 🎭 **Lucide React 0.441.0** - Beautiful icon library
- 🌈 **Tailwind CSS Animate 1.0.7** - Animation utilities
- 🎨 **Class Variance Authority** - Component variant management
- 🔧 **CLSX & Tailwind Merge** - Class name utilities

### **State Management**
- 🔄 **React Context API** - Global state management
  - AuthContext, ClassContext, WalletContext
  - FeedbackContext, QuestionContext, AvatarContext
  - ThemeProvider
- 💾 **SessionStorage/LocalStorage** - Client-side persistence

### **HTTP & API**
- 🌐 **Axios 1.7.7** - HTTP client with interceptors
- 🔄 **TanStack React Query 5.59.20** - Data fetching and caching

### **UI Components & Libraries**
- 📊 **Recharts 2.13.3** - Chart and graph library
- 📅 **React Day Picker 8.10.1** - Date picker component
- 📝 **React Quill 2.0.0** - Rich text editor
- 📄 **React PDF 9.2.1** - PDF viewer and renderer
- 📊 **MUI X Data Grid 7.23.5** - Advanced data tables
- 📊 **MUI X Charts 7.22.1** - Chart components
- 📋 **React Select 5.8.2** - Select component
- 🎠 **React Multi Carousel 2.8.5** - Carousel component
- 🔢 **React OTP Input 3.1.1** - OTP input component
- 📊 **React Excel Renderer 1.1.0** - Excel file handling

### **Utilities & Helpers**
- 🔔 **React Hot Toast 2.4.1** - Toast notification system
- 📦 **Lodash 4.17.21** - Utility functions
- 📅 **Day.js 1.11.13** - Date manipulation library
- 📅 **Moment.js 2.30.1** - Date and time library
- 📅 **Date-fns 3.6.0** - Modern date utility library
- 🧹 **DOMPurify 3.1.7** - HTML sanitization
- 💾 **File Saver 2.0.5** - File download utility
- 📄 **Mammoth 1.9.0** - Word document converter

### **Material UI**
- 🎨 **MUI Material 6.1.6** - Material Design components
- 🎨 **MUI Styled Engine SC** - Styled components engine
- 🎨 **Emotion React & Styled** - CSS-in-JS library

### **Editor**
- 📝 **CKEditor 5 43.3.1** - Rich text editor
- 📝 **CKEditor React 9.3.1** - React integration

### **Development Tools**
- 🔍 **ESLint 9.9.0** - Code linting and quality
- ⚡ **Vite Plugin React SWC 3.5.0** - Fast refresh with SWC
- 🎯 **PostCSS & Autoprefixer** - CSS processing
- 📦 **TypeScript Types** - Type definitions for React

---

## 🚀 Getting Started

### **Prerequisites**

Make sure you have the following installed:
- 📦 **Node.js** (v16 or higher recommended)
- 📦 **npm** (v7 or higher) or **yarn** package manager
- 🌐 **Git** for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LSS_FrontEnd.git
   cd LSS_FrontEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=your_api_url_here
   ```
   
   The application uses a proxy configuration in `vite.config.js` for development.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

7. **Lint code**
   ```bash
   npm run lint
   # or
   yarn lint
   ```

---

## 📁 Project Structure

LSS_FrontEnd/
├── 📂 public/ # Static assets
│ └── ... # Public files
│
├── 📂 src/
│ ├── 📂 assets/ # Images, fonts, and static assets
│ │ └── ... # Asset files
│ │
│ ├── 📂 components/ # React components
│ │ ├── 📂 Admin/ # Admin dashboard components
│ │ │ ├── admin-layout.jsx # Admin sidebar layout
│ │ │ ├── AdminHome.jsx # Admin dashboard home
│ │ │ ├── ListUser.jsx # User list management
│ │ │ ├── ListTeacher.jsx # Teacher list management
│ │ │ ├── CreateStaff.jsx # Staff creation
│ │ │ ├── Classes.jsx # Class management
│ │ │ ├── RegisterApp.jsx # Registration applications
│ │ │ ├── WithdrawApp.jsx # Withdrawal applications
│ │ │ ├── OtherApp.jsx # Other applications
│ │ │ ├── EditParams.jsx # System parameters
│ │ │ └── components/ # Admin sub-components
│ │ │
│ │ ├── 📂 Student/ # Student dashboard components
│ │ │ ├── Profile.jsx # Student profile
│ │ │ ├── Wallet.jsx # Wallet management
│ │ │ ├── All_Transactions.jsx # Transaction history
│ │ │ ├── Order.jsx # Order management
│ │ │ ├── MyClass.jsx # Enrolled classes
│ │ │ ├── All_Class.jsx # Browse all classes
│ │ │ ├── class-detail.jsx # Class details
│ │ │ ├── Documents.jsx # Document viewer
│ │ │ ├── Feedback.jsx # Feedback form
│ │ │ ├── send-application.jsx # Submit applications
│ │ │ ├── ViewApplication.jsx # View applications
│ │ │ ├── Notifications.jsx # Notifications
│ │ │ ├── News.jsx # News list
│ │ │ ├── NewsDetail.jsx # News details
│ │ │ ├── TeacherProfile.jsx # Teacher profiles
│ │ │ └── EnhancedPDFViewer.jsx # PDF viewer
│ │ │
│ │ ├── 📂 Teacher/ # Teacher dashboard components
│ │ │ ├── TeacherDashboardLayout.jsx # Teacher layout
│ │ │ ├── TeacherHome.jsx # Teacher dashboard
│ │ │ ├── ClassList.jsx # Class list
│ │ │ ├── UpdateSchedule.jsx # Schedule updates
│ │ │ ├── CancelClassRequest.jsx # Cancellation requests
│ │ │ ├── ProfileTeacher.jsx # Teacher profile
│ │ │ ├── WalletTeacher.jsx # Teacher wallet
│ │ │ ├── SendApplicationTeacher.jsx # Teacher applications
│ │ │ ├── ViewApplicationTeacher.jsx # View applications
│ │ │ └── ... # Other teacher components
│ │ │
│ │ ├── 📂 Staff/ # Staff dashboard components
│ │ │ └── Dashboard.jsx # Staff dashboard
│ │ │
│ │ ├── 📂 Auth/ # Authentication components
│ │ │ ├── Login.jsx # Login page
│ │ │ ├── SignUp.jsx # Registration
│ │ │ ├── ForgotPassword.jsx # Password reset
│ │ │ ├── ResetPassword.jsx # Reset password
│ │ │ ├── VerifyOtpRegister.jsx # OTP verification (register)
│ │ │ ├── VerifyOtpForgot.jsx # OTP verification (forgot)
│ │ │ └── ProtectedRoute.jsx # Route protection
│ │ │
│ │ ├── 📂 Home/ # Landing page components
│ │ │ ├── Course-Landing-Page.jsx # Home page
│ │ │ └── AboutMe.jsx # About page
│ │ │
│ │ ├── 📂 Application/ # Application components
│ │ │ └── Application.jsx # Application form
│ │ │
│ │ ├── 📂 Helper/ # Reusable helper components
│ │ │ └── Modal.jsx # Modal component
│ │ │
│ │ ├── 📂 Notfound/ # Error pages
│ │ │ └── NotFound.jsx # 404 page
│ │ │
│ │ ├── 📂 VnPay/ # Payment components
│ │ │ └── ... # VNPay integration
│ │ │
│ │ └── 📂 ui/ # UI component library
│ │ └── ... # Reusable UI components
│ │
│ ├── 📂 context/ # React Context providers
│ │ ├── AuthContext.jsx # Authentication state
│ │ ├── ClassContext.jsx # Class management state
│ │ ├── WalletContext.jsx # Wallet state
│ │ ├── FeedbackContext.jsx # Feedback state
│ │ ├── QuestionContext.jsx # Question state
│ │ ├── AvatarContext.jsx # User profile state
│ │ └── Theme-Provider.jsx # Theme management
│ │
│ ├── 📂 data/ # API functions
│ │ └── api.js # All API endpoints (170+ functions)
│ │
│ ├── 📂 Layout/ # Layout components
│ │ └── Layout.jsx # Main layout wrapper
│ │
│ ├── 📂 lib/ # Utility functions
│ │ └── ... # Helper utilities
│ │
│ ├── App.jsx # Main app component with routing
│ ├── main.jsx # Application entry point
│ └── index.css # Global styles
│
├── 📄 package.json # Dependencies and scripts
├── 📄 package-lock.json # Lock file
├── 📄 vite.config.js # Vite configuration
├── 📄 tailwind.config.js # Tailwind CSS configuration
├── 📄 postcss.config.js # PostCSS configuration
├── 📄 eslint.config.js # ESLint configuration
├── 📄 jsconfig.json # JavaScript configuration
├── 📄 components.json # Component configuration
├── 📄 vercel.json # Vercel deployment config
├── 📄 index.html # HTML entry point
└── 📄 README.md # This file


---

## 🎭 Key Features by Role

### 👨‍🎓 Student Dashboard

**Navigation & Overview:**
- 🏠 **Home** - Browse available classes with search and filters
- 📚 **My Classes** - View all enrolled classes with status
- 📖 **All Classes** - Browse and search all available classes
- 📄 **Class Details** - Detailed view with schedule, teacher info, and enrollment

**Financial Management:**
- 💳 **Wallet** - View balance, recharge, and manage funds
- 📊 **Transaction History** - Complete history of all transactions
- 📋 **Orders** - View and track class orders
- 💰 **Payment Integration** - Secure VNPay payment gateway

**Applications:**
- 📝 **Send Applications** - Submit registration, withdrawal, or other applications
- 📋 **View Applications** - Track application status and history
- ✅ **Application Status** - Real-time status updates

**Learning Resources:**
- 📄 **Documents** - Access class materials and documents
- 📚 **Class Materials** - View PDFs and other resources
- 📊 **Schedules** - View class timetables

**Community & Feedback:**
- ⭐ **Feedback** - Rate and review classes and teachers
- 📰 **News** - Read announcements and news articles
- 👤 **Teacher Profiles** - View teacher information and ratings

**Account Management:**
- 👤 **Profile** - Manage personal information
- 🔔 **Notifications** - View and manage notifications
- ⚙️ **Settings** - Account settings and preferences

### 👨‍🏫 Teacher Dashboard

**Class Management:**
- 📚 **Class List** - View all your classes with status
- ➕ **Create Class** - Create new classes with images and details
- ✏️ **Edit Class** - Update class information
- 📅 **Update Schedule** - Modify class schedules and timings
- 📍 **Update Location** - Change class locations
- 👥 **Student List** - View enrolled students per class
- ✅ **Class Status** - Manage class status (Active, Ongoing, Completed, Cancelled)
- ❌ **Cancel Requests** - Handle class cancellation requests

**Schedule Management:**
- 📅 **Schedule Overview** - View complete teaching schedule
- ⏰ **Time Slot Management** - Manage available time slots
- 📋 **Detailed Timetable** - View detailed schedule information
- 🔄 **Schedule Updates** - Update availability and timings

**Applications:**
- 📝 **Send Applications** - Submit teacher applications
- 📋 **View Applications** - Track application status
- ✅ **Application Tracking** - Monitor approval status

**Financial:**
- 💰 **Wallet** - View earnings and balance
- 📊 **Payment History** - Track all payments
- 💸 **Withdrawal Requests** - Submit and track withdrawals
- 📈 **Earnings Statistics** - View financial analytics

**Profile & Analytics:**
- 👤 **Profile** - Manage teacher profile and information
- ⭐ **Ratings** - View student ratings and feedback
- 📊 **Statistics** - Teaching statistics and analytics
- 📈 **Performance Metrics** - Track teaching performance

### 👨‍💼 Admin Dashboard

**User Management:**
- 👥 **List Users** - View all users with search and filters
  - User details and information
  - Account status management
  - User statistics by role
- 🎓 **List Teachers** - Manage all teacher accounts
  - Teacher information and status
  - Teacher activation/deactivation
  - Teacher statistics
- ➕ **Create Staff** - Register new staff members
  - Staff account creation
  - Role assignment
  - Access management

**Class Management:**
- 📚 **Classes Overview** - View all classes in the system
- 📊 **Class Statistics** - Analytics by status and month
  - Active classes by month
  - Ongoing classes by month
  - Completed classes by month
  - Cancelled classes by month
- 🔍 **Class Search & Filter** - Advanced filtering options
- 📈 **Class Analytics** - Detailed reports and charts
- ✅ **Class Oversight** - Monitor class status and progress

**Application Management:**
- 📋 **Registration Applications** - Review and approve student registrations
  - Application list and details
  - Approval/rejection workflow
  - Email notifications
- 💸 **Withdrawal Applications** - Process withdrawal requests
  - Withdrawal request management
  - Approval workflow
  - Financial tracking
- 📄 **Other Applications** - Handle miscellaneous applications
  - Application review
  - Approval process
  - Status tracking
- ✅ **Application Workflow** - Complete approval/rejection system
- 📧 **Application Notifications** - Automated email notifications
- 🔄 **Application Assignment** - Assign applications to staff

**System Configuration:**
- ⚙️ **Edit Parameters** - Configure system settings
  - System parameter management
  - Configuration updates
  - Settings persistence
- 📊 **Dashboard Analytics** - Comprehensive statistics
  - User counts by role
  - Total orders and revenue
  - Class statistics
  - Financial metrics
- 📈 **Revenue Tracking** - Monitor financial metrics
- 📉 **Class Status Reports** - Detailed status breakdowns

**Content Management:**
- 📰 **News Management** - Create, edit, and publish news articles
  - News creation and editing
  - News publishing
  - News analytics
- 📄 **Document Management** - Oversee system documents
- 🎓 **Category Management** - Manage course categories

### 👨‍💻 Staff Dashboard

**Application Processing:**
- 📋 **View Applications** - View assigned applications
- ✅ **Process Applications** - Approve or reject applications
- ❌ **Reject Applications** - Reject with detailed reasons
- 📧 **Send Notifications** - Email notifications to users
- 📊 **Application Statistics** - View processing metrics

**Dashboard:**
- 📈 **Overview** - Assigned tasks and metrics
- 📊 **Application Metrics** - Statistics and reports
- 🔔 **Notification Management** - Manage notifications

---

## 🔌 API Integration

The application integrates with a comprehensive REST API backend with **170+ API endpoints**. All API calls are centralized in `src/data/api.js` using Axios with proper error handling and authentication.

### **API Categories:**

**Authentication APIs:**
- 🔐 Login, Register (Student/Teacher)
- 📧 OTP Verification (Register/Forgot Password)
- 🔒 Password Reset
- 🔑 Token Management

**User Management APIs:**
- 👥 List Users, List Teachers
- ➕ Create Staff
- ✅ Activate/Deactivate Users
- 📊 User Statistics

**Class Management APIs:**
- 📚 Get All Classes, Get Class by ID
- ➕ Create Class, Update Class
- 🗑️ Delete Class
- 📅 Schedule Management
- 📍 Location Updates
- ✅ Status Management (Active, Ongoing, Completed, Cancelled)
- 📊 Class Statistics and Analytics
- 🔍 Class Search and Filtering

**Application APIs:**
- 📝 Create Application (Register, Withdraw, Other)
- 📋 View Applications
- ✅ Approve/Reject Applications
- 🔄 Cancel Applications
- 📧 Email Notifications
- 🔄 Application Assignment

**Wallet & Payment APIs:**
- 💰 Get Balance (Student/Teacher)
- 💳 Recharge Wallet
- 📊 Transaction History
- 💸 Withdrawal Requests
- 💵 VNPay Integration
- 📈 Financial Analytics

**Document APIs:**
- 📄 Upload Documents
- ✏️ Update Documents
- 🗑️ Delete Documents
- 📚 Get Documents by Class
- 🔍 Document Search

**Feedback APIs:**
- ⭐ Submit Feedback
- 📊 Get Feedback by Class
- 📈 Feedback Statistics
- ❓ Feedback Questions
- 📄 Feedback Details

**News APIs:**
- 📰 Create News
- ✏️ Update News
- 📄 Get All News
- 🔍 Get News by ID
- 🗑️ Delete News

**Notification APIs:**
- 🔔 View All Notifications
- ✅ Mark as Read/Unread
- 🗑️ Delete Notifications
- 📊 Notification Statistics

**Analytics APIs:**
- 📊 Dashboard Statistics
- 👥 User Counts by Role
- 📚 Class Statistics
- 💰 Revenue Analytics
- 📈 Monthly Reports
- 📉 Status Reports

---

## 🔄 State Management

The application uses **React Context API** for global state management with the following contexts:

### **AuthContext**
- 🔐 Authentication state (isLoggedIn, loading)
- 🔑 Login/Logout functions
- 💾 Session management
- 🎨 Theme integration on logout

### **ClassContext**
- 📚 Class data management
- 🔄 Fetch classes function
- 💾 SessionStorage persistence
- 🔍 Class filtering and search
- 🗑️ Clear classes function

### **WalletContext**
- 💰 Balance state
- 🔄 Load balance function
- ⏳ Loading and error states
- 📊 Transaction management

### **FeedbackContext**
- ⭐ Submitted feedback tracking
- ➕ Add feedback order ID
- 🗑️ Clear feedback IDs
- 💾 LocalStorage persistence

### **QuestionContext**
- ❓ Feedback questions
- 🔄 Fetch questions function
- ⏳ Loading and error states

### **AvatarContext**
- 👤 User profile data
- 🔄 Update profile function
- 💾 LocalStorage persistence

### **ThemeProvider**
- 🌓 Theme state (light/dark/system)
- 🔄 Set theme function
- 💾 LocalStorage persistence
- 🖥️ System theme detection

---

## 🚀 Deployment

The application is configured for deployment on **Vercel** with:

- ✅ **SPA Routing Support** - Proper routing configuration
- ✅ **Environment Variables** - Secure configuration
- ✅ **Production Build** - Optimized production builds
- ✅ **API Proxy** - Development proxy configuration
- ✅ **Static Asset Optimization** - Optimized asset delivery

### **Deploy to Vercel**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings

3. **Configure Environment Variables**
   - Add `VITE_API_URL` in Vercel dashboard
   - Configure other environment variables

4. **Deploy!** 🎉
   - Vercel will automatically deploy
   - Get your production URL

### **Other Deployment Options**

- 🌐 **Netlify** - Similar configuration
- ☁️ **AWS Amplify** - AWS deployment
- 🐳 **Docker** - Containerized deployment
- 🖥️ **Self-hosted** - Custom server deployment

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### **How to Contribute:**

1. 🍴 **Fork the repository**
2. 🌿 **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push to the branch** (`git push origin feature/AmazingFeature`)
5. 🔀 **Open a Pull Request**

### **Code Style:**
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Follow React best practices
- Write clean, readable code

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author


- 🌐 GitHub: [@baosetsuna123](https://github.com/baosetsuna123)
- 📧 Email: baohse321@gmail.com
- 💼 LinkedIn: [Bao Tran](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible components
- All contributors and open-source libraries used

---

<div align="center">

**⭐ If you like this project, give it a star on GitHub! ⭐**

Made with ❤️ using React and Vite

[⬆ Back to Top](#-learning-support-system-lss-frontend)

</div>
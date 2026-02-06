// Projects data for Files/Projects component
export const projects = [
    {
        id: 'build-mate-plus',
        name: 'Build Mate Plus',
        description: 'Comprehensive construction management tool for tracking materials, budgets, and progress',
        category: 'Web Application',
        tech: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Express'],
        date: '2024',
        status: 'Completed',
        type: 'Capstone Project',
        icon: '🏗️',
        color: '#FF6B35',
        github: 'https://github.com/GAP-Pathum/build-mate-plus',
        demo: 'https://build-mate-plus.vercel.app',
        readme: `# Build Mate Plus

## 🏗️ Overview
Build Mate Plus is a comprehensive construction management platform designed to streamline project workflows, material tracking, and budget management for construction companies and contractors.

## ✨ Key Features
- **Material Tracking**: Real-time inventory management system
- **Budget Management**: Detailed cost analysis and forecasting
- **Progress Monitoring**: Visual project timeline with milestones
- **Team Collaboration**: Role-based access control
- **Document Management**: Centralized file storage
- **Mobile Responsive**: Access anywhere, anytime

## 🛠️ Technologies Used
- **Frontend**: React.js with modern hooks
- **Backend**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based secure auth
- **Deployment**: Vercel (Frontend) & Heroku (Backend)

## 🎯 Project Impact
This capstone project demonstrates full-stack development capabilities, from database design to deployment, serving as a complete solution for construction project management.

## 📊 Technical Highlights
- RESTful API architecture
- Real-time data synchronization
- Responsive design for all devices
- Advanced search and filtering
- Export to PDF/Excel functionality`,
        images: [
            { id: 1, name: 'Dashboard', alt: 'Build Mate Plus Dashboard', thumbnail: '/photos/projects/build-mate-plus/thumb-1.jpg', full: '/photos/projects/build-mate-plus/1.jpg' },
            { id: 2, name: 'Material Tracking', alt: 'Material Inventory View', thumbnail: '/photos/projects/build-mate-plus/thumb-2.jpg', full: '/photos/projects/build-mate-plus/2.jpg' },
            { id: 3, name: 'Budget Overview', alt: 'Budget Management Interface', thumbnail: '/photos/projects/build-mate-plus/thumb-3.jpg', full: '/photos/projects/build-mate-plus/3.jpg' }
        ]
    },
    {
        id: 'foody',
        name: 'Foody',
        description: 'User-friendly online food ordering platform with real-time tracking and payment integration',
        category: 'Web Application',
        tech: ['React', 'Express', 'MongoDB', 'Stripe', 'Socket.io'],
        date: '2024',
        status: 'Completed',
        type: 'Personal Project',
        icon: '🍔',
        color: '#FF9500',
        github: 'https://github.com/GAP-Pathum/foody',
        demo: 'https://foody-app.vercel.app',
        readme: `# Foody - Online Food Ordering

## 🍕 Overview
Foody is a modern food ordering application that connects customers with local restaurants, featuring real-time order tracking, secure payments, and an intuitive user experience.

## ✨ Features
- **Browse Restaurants**: Search and filter by cuisine, rating, price
- **Menu Management**: Dynamic menu with categories and specials
- **Shopping Cart**: Persistent cart with promo codes
- **Real-time Tracking**: Live order status updates
- **Secure Payments**: Stripe integration for safe transactions
- **Rating System**: Customer reviews and ratings
- **Admin Dashboard**: Restaurant management interface

## 🛠️ Tech Stack
- **Frontend**: React with React Router
- **Backend**: Express.js REST API
- **Database**: MongoDB
- **Real-time**: Socket.io for live updates
- **Payments**: Stripe API
- **Image Storage**: Cloudinary

## 🎯 Challenges Solved
- Real-time order synchronization
- Payment gateway integration
- Responsive design for mobile ordering
- Cart persistence across sessions

## 📱 Mobile First Design
Built with mobile users in mind, featuring touch-friendly interfaces and offline cart functionality.`,
        images: [
            { id: 1, name: 'Home', alt: 'Foody Homepage', thumbnail: '/photos/projects/foody/thumb-1.jpg', full: '/photos/projects/foody/1.jpg' },
            { id: 2, name: 'Menu', alt: 'Restaurant Menu', thumbnail: '/photos/projects/foody/thumb-2.jpg', full: '/photos/projects/foody/2.jpg' },
            { id: 3, name: 'Cart', alt: 'Shopping Cart', thumbnail: '/photos/projects/foody/thumb-3.jpg', full: '/photos/projects/foody/3.jpg' }
        ]
    },
    {
        id: 'syncpress',
        name: 'SyncPress',
        description: 'Digital printing services management application for orders and customer interactions',
        category: 'Web Application',
        tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'jQuery'],
        date: '2023',
        status: 'Completed',
        type: 'Client Project',
        icon: '🖨️',
        color: '#007AFF',
        github: null,
        demo: null,
        readme: `# SyncPress - Print Shop Manager

## 🖨️ Overview
SyncPress is a comprehensive management system for digital printing businesses, handling everything from customer orders to inventory tracking and billing.

## ✨ Features
- **Order Management**: Track print jobs from submission to completion
- **Customer Portal**: Self-service order placement and tracking
- **Inventory System**: Paper stock, ink, and supplies management
- **Pricing Calculator**: Dynamic pricing based on specs
- **Invoice Generation**: Automated billing and payment tracking
- **Staff Management**: Role-based access for employees

## 🛠️ Technologies
- **Backend**: PHP with MVC architecture
- **Database**: MySQL with normalized schema
- **Frontend**: Bootstrap 5 for responsive design
- **JavaScript**: jQuery for dynamic interactions
- **PDF Generation**: FPDF library for invoices

## 🎯 Business Impact
Streamlined operations for a local print shop, reducing order processing time by 60% and improving customer satisfaction.

## 📊 Key Modules
1. Order intake and specifications
2. Production queue management
3. Customer relationship management
4. Financial reporting and analytics
5. Email notifications and reminders`,
        images: [
            { id: 1, name: 'Dashboard', alt: 'SyncPress Dashboard', thumbnail: '/photos/projects/syncpress/thumb-1.jpg', full: '/photos/projects/syncpress/1.jpg' },
            { id: 2, name: 'Orders', alt: 'Order Management', thumbnail: '/photos/projects/syncpress/thumb-2.jpg', full: '/photos/projects/syncpress/2.jpg' }
        ]
    },
    {
        id: 'spam-detector',
        name: 'Spam Detector',
        description: 'ML-powered spam detection for English and Sinhala messages using NLP techniques',
        category: 'Machine Learning',
        tech: ['Python', 'Scikit-learn', 'Flask', 'TF-IDF', 'Naive Bayes'],
        date: '2024',
        status: 'Completed',
        type: 'Academic Project',
        icon: '🛡️',
        color: '#34C759',
        github: 'https://github.com/GAP-Pathum/spam-detector',
        demo: 'https://spam-detector-sl.herokuapp.com',
        readme: `# Spam Detector - Bilingual SMS Classification

## 🛡️ Overview
A machine learning web application that detects spam in both English and Sinhala messages, trained on SMSSpamCollection and SinhalaSpamCollection datasets.

## ✨ Features
- **Bilingual Support**: Handles English and Sinhala text
- **Real-time Prediction**: Instant spam classification
- **Confidence Scores**: Probability percentages
- **Model Comparison**: Multiple algorithms tested
- **Web Interface**: Simple, user-friendly design
- **API Endpoint**: RESTful API for integration

## 🛠️ Tech Stack
- **ML Framework**: Scikit-learn
- **NLP**: TF-IDF Vectorization, NLTK
- **Web Framework**: Flask
- **Frontend**: HTML/CSS/JavaScript
- **Deployment**: Heroku

## 🎯 Model Performance
- **Accuracy**: 97.8% on test data
- **Algorithm**: Multinomial Naive Bayes
- **Features**: TF-IDF with n-grams (1,2)
- **Dataset Size**: 10,000+ messages

## 📊 Technical Details
1. Text preprocessing and cleaning
2. TF-IDF feature extraction
3. Model training and validation
4. Cross-validation for robustness
5. Confusion matrix analysis

## 🌐 Sinhala NLP Challenges
Addressed unique challenges in Sinhala text processing including Unicode handling and limited dataset availability.`,
        images: [
            { id: 1, name: 'Interface', alt: 'Spam Detector Interface', thumbnail: '/photos/projects/spam-detector/thumb-1.jpg', full: '/photos/projects/spam-detector/1.jpg' },
            { id: 2, name: 'Results', alt: 'Detection Results', thumbnail: '/photos/projects/spam-detector/thumb-2.jpg', full: '/photos/projects/spam-detector/2.jpg' }
        ]
    },
    {
        id: 'react-portfolio',
        name: 'React Vite Portfolio',
        description: 'Personal portfolio with smooth animations, dark mode, and interactive project showcase',
        category: 'Web Application',
        tech: ['React', 'Vite', 'Bootstrap', 'Framer Motion', 'CSS3'],
        date: '2023',
        status: 'Completed',
        type: 'Personal Project',
        icon: '💼',
        color: '#5856D6',
        github: 'https://github.com/GAP-Pathum/react-portfolio',
        demo: 'https://pathum-portfolio.vercel.app',
        readme: `# React Vite Portfolio

## 💼 Overview
A modern, animated personal portfolio built with React and Vite, featuring smooth transitions, dark mode support, and an engaging user experience.

## ✨ Features
- **Smooth Animations**: Framer Motion for page transitions
- **Dark/Light Mode**: Theme switcher with persistence
- **Responsive Design**: Mobile-first approach
- **Project Showcase**: Interactive project cards
- **About Section**: Skills and experience timeline
- **Contact Form**: EmailJS integration
- **SEO Optimized**: Meta tags and semantic HTML

## 🛠️ Technologies
- **Build Tool**: Vite for lightning-fast HMR
- **Framework**: React 18 with Hooks
- **Animations**: Framer Motion
- **Styling**: Bootstrap 5 + Custom CSS
- **Icons**: React Icons
- **Forms**: React Hook Form

## 🎯 Performance
- **Lighthouse Score**: 95+ across all metrics
- **Load Time**: <1s on 3G
- **Bundle Size**: Optimized with code splitting

## 📱 Design Philosophy
Clean, minimalist design with focus on content and user experience. Accessibility-first with keyboard navigation and screen reader support.`,
        images: [
            { id: 1, name: 'Hero', alt: 'Portfolio Hero Section', thumbnail: '/photos/projects/react-portfolio/thumb-1.jpg', full: '/photos/projects/react-portfolio/1.jpg' },
            { id: 2, name: 'Projects', alt: 'Projects Grid', thumbnail: '/photos/projects/react-portfolio/thumb-2.jpg', full: '/photos/projects/react-portfolio/2.jpg' }
        ]
    },
    {
        id: 'drug-inventory',
        name: 'Drug Inventory Dashboard',
        description: 'Role-based pharmaceutical inventory management system with real-time stock tracking',
        category: 'Web Application',
        tech: ['PHP', 'Laravel', 'Bootstrap', 'MySQL', 'Chart.js'],
        date: '2023',
        status: 'Completed',
        type: 'Client Project',
        icon: '💊',
        color: '#FF2D55',
        github: null,
        demo: null,
        readme: `# Drug Inventory Dashboard

## 💊 Overview
A comprehensive pharmaceutical inventory management system built for pharmacies and medical facilities to track drug stock, expiry dates, and supplier information.

## ✨ Features
- **Stock Management**: Real-time inventory tracking
- **Expiry Alerts**: Notifications for expiring medications
- **Role-Based Access**: Admin, Pharmacist, Staff roles
- **Supplier Management**: Vendor contact and order history
- **Sales Reports**: Analytics and visualizations
- **Barcode Scanning**: Quick drug lookup
- **Low Stock Alerts**: Automated reorder notifications

## 🛠️ Tech Stack
- **Framework**: Laravel (PHP)
- **Database**: MySQL with migrations
- **Frontend**: Bootstrap 5
- **Charts**: Chart.js for analytics
- **PDF**: DomPDF for reports
- **Authentication**: Laravel Sanctum

## 🎯 Key Benefits
- Prevents stock-outs and overstocking
- Reduces medication waste from expiry
- Streamlines procurement process
- Comprehensive audit trails

## 📊 Dashboard Metrics
- Total inventory value
- Expiring items (30/60/90 days)
- Top-selling medications
- Supplier performance
- Monthly sales trends`,
        images: [
            { id: 1, name: 'Dashboard', alt: 'Inventory Dashboard', thumbnail: '/photos/projects/drug-inventory/thumb-1.jpg', full: '/photos/projects/drug-inventory/1.jpg' }
        ]
    },
    {
        id: 'hotel-booking',
        name: 'Hotel Booking System',
        description: 'Innovative booking system using Google Sheets as backend for real-time room availability',
        category: 'Web Application',
        tech: ['HTML', 'CSS', 'JavaScript', 'Google Apps Script', 'Google Sheets API'],
        date: '2023',
        status: 'Completed',
        type: 'Client Project',
        icon: '🏨',
        color: '#FF9500',
        github: null,
        demo: null,
        readme: `# Hotel Booking System

## 🏨 Overview
A lightweight hotel reservation system leveraging Google Sheets as a database, providing real-time room availability and booking management without traditional backend infrastructure.

## ✨ Features
- **Real-time Availability**: Google Sheets sync
- **Room Selection**: Interactive calendar interface
- **Booking Management**: View, edit, cancel reservations
- **Email Confirmations**: Automated booking receipts
- **Payment Integration**: Stripe for deposits
- **Admin Panel**: Google Sheets as admin interface
- **Multi-property Support**: Manage multiple locations

## 🛠️ Technologies
- **Frontend**: Vanilla JavaScript
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **APIs**: Google Sheets API v4
- **Styling**: Custom CSS with animations
- **Payments**: Stripe Checkout

## 🎯 Innovation
Eliminates need for traditional database, reducing costs and complexity while maintaining real-time synchronization. Perfect for small hotels and B&Bs.

## 📊 Google Sheets Structure
1. Bookings sheet (reservations log)
2. Rooms sheet (inventory)
3. Pricing sheet (seasonal rates)
4. Customers sheet (guest database)

## 🔒 Security
Row-level security via Google Apps Script, encrypted customer data, PCI-compliant payment processing.`,
        images: [
            { id: 1, name: 'Booking Form', alt: 'Hotel Booking Interface', thumbnail: '/photos/projects/hotel-booking/thumb-1.jpg', full: '/photos/projects/hotel-booking/1.jpg' }
        ]
    },
    {
        id: 'diet-recommender',
        name: 'Ayurvedic Diet Recommender',
        description: 'ML-based diet recommendation system based on Ayurvedic Dosha types and Sri Lankan cuisine',
        category: 'Machine Learning',
        tech: ['Python', 'Google Colab', 'Pandas', 'Scikit-learn', 'Matplotlib'],
        date: '2024',
        status: 'Completed',
        type: 'Academic Project',
        icon: '🥗',
        color: '#34C759',
        github: 'https://github.com/GAP-Pathum/ayurvedic-diet',
        demo: null,
        readme: `# Ayurvedic Diet Recommender

## 🥗 Overview
A machine learning system that recommends personalized Ayurvedic diets and Sri Lankan foods based on user's Dosha type (Vata, Pitta, Kapha) and health goals.

## ✨ Features
- **Dosha Assessment**: Quiz-based body type determination
- **Personalized Recommendations**: Diet plans per Dosha
- **Sri Lankan Cuisine**: Local food database
- **Seasonal Suggestions**: Weather-based recommendations
- **Nutritional Analysis**: Macro and micronutrient tracking
- **Recipe Database**: Traditional Ayurvedic recipes

## 🛠️ Tech Stack
- **Language**: Python 3.x
- **ML Framework**: Scikit-learn
- **Algorithms**: Decision Trees, K-Nearest Neighbors
- **Data Science**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn
- **Environment**: Google Colab

## 🎯 ML Model
- **Input Features**: Age, weight, height, symptoms, preferences
- **Output**: Dosha classification + food recommendations
- **Accuracy**: 89% on validation set
- **Dataset**: 500+ Ayurvedic food items

## 📊 Data Sources
1. Traditional Ayurvedic texts
2. Sri Lankan food nutritional database
3. Expert consultations
4. User feedback data

## 🌿 Cultural Integration
Bridges ancient Ayurvedic wisdom with modern ML techniques, promoting traditional Sri Lankan dietary practices.`,
        images: [
            { id: 1, name: 'Interface', alt: 'Diet Recommender Interface', thumbnail: '/photos/projects/diet-recommender/thumb-1.jpg', full: '/photos/projects/diet-recommender/1.jpg' }
        ]
    },
    {
        id: 'buddha-nalagiri',
        name: 'Buddha and Nalagiri',
        description: 'AI-generated short film depicting ancient Buddhist story with cinematic visuals',
        category: 'Creative/AI',
        tech: ['Grok Imagine', 'Adobe Premiere', 'DaVinci Resolve', 'After Effects'],
        date: '2024',
        status: 'Completed',
        type: 'Creative Project',
        icon: '🎬',
        color: '#FFD60A',
        github: null,
        demo: 'https://youtu.be/buddha-nalagiri',
        readme: `# Buddha and Nalagiri - AI Film

## 🎬 Overview
A cinematic short film telling the Buddhist story of Buddha taming the wild elephant Nalagiri, created entirely using AI-generated imagery and professional video editing.

## ✨ Production Details
- **Story**: Ancient Buddhist tale of compassion
- **Visuals**: AI-generated scenes
- **Setting**: Ancient India
- **Duration**: 5 minutes
- **Aspect Ratio**: 16:9 Cinematic
- **Resolution**: 4K

## 🛠️ Technologies
- **Image Generation**: Grok Imagine AI
- **Video Editing**: Adobe Premiere Pro
- **Color Grading**: DaVinci Resolve
- **VFX**: After Effects
- **Sound Design**: Audacity + royalty-free music

## 🎯 Creative Process
1. Storyboarding and scene planning
2. AI prompt engineering for visuals
3. Image sequence generation
4. Video compilation and transitions
5. Color grading for ancient aesthetic
6. Sound design and music sync
7. Final rendering and export

## 📊 Technical Challenges
- Maintaining visual consistency across AI-generated frames
- Creating smooth transitions between static images
- Achieving authentic ancient Indian atmosphere
- Synchronizing narration with visuals

## 🌟 Artistic Achievement
Demonstrates innovative use of AI in storytelling while preserving cultural and spiritual authenticity.`,
        images: [
            { id: 1, name: 'Scene 1', alt: 'Buddha and Nalagiri Opening', thumbnail: '/photos/projects/buddha-nalagiri/thumb-1.jpg', full: '/photos/projects/buddha-nalagiri/1.jpg' }
        ]
    },
    {
        id: 'vegetable-price-slr',
        name: 'Vegetable Price Prediction SLR',
        description: 'Systematic Literature Review on ML-based vegetable price forecasting in Sri Lankan agriculture',
        category: 'Research',
        tech: ['Research Methods', 'IEEE Xplore', 'Google Scholar', 'Excel', 'Pandas'],
        date: '2024',
        status: 'Completed',
        type: 'Academic Research',
        icon: '📊',
        color: '#32D74B',
        github: null,
        demo: null,
        readme: `# Vegetable Price Prediction - Systematic Literature Review

## 📊 Overview
A comprehensive systematic literature review examining machine learning approaches for vegetable price forecasting in Sri Lanka's agricultural sector.

## ✨ Research Scope
- **Time Period**: 2015-2024
- **Databases**: IEEE Xplore, ScienceDirect, Google Scholar
- **Papers Reviewed**: 75+ publications
- **Focus**: ML applications in agriculture
- **Geography**: Sri Lankan context

## 🛠️ Methodology
- **Framework**: PRISMA guidelines
- **Search Strategy**: Boolean queries
- **Selection Criteria**: Rigorous inclusion/exclusion
- **Quality Assessment**: Critical appraisal
- **Data Extraction**: Systematic coding
- **Analysis**: Thematic synthesis

## 🎯 Key Findings
1. **Popular Algorithms**: ARIMA, LSTM, Random Forest
2. **Data Sources**: Market prices, weather, seasonal patterns
3. **Accuracy Range**: 75-92% depending on model
4. **Challenges**: Data availability, market volatility
5. **Opportunities**: IoT integration, real-time prediction

## 📊 Research Contributions
- Identified research gaps in Sri Lankan context
- Compared effectiveness of different ML approaches
- Recommendations for future research directions
- Practical implications for farmers and policymakers

## 🌾 Impact
Provides foundational knowledge for developing price prediction systems to help Sri Lankan farmers make informed planting and harvesting decisions.

## 📚 Publications
Results compiled in academic paper submitted to agricultural economics journal.`,
        images: []
    }
];

// Helper functions
export function getProjectById(id) {
    return projects.find(p => p.id === id);
}

export function getProjectsByCategory(category) {
    return projects.filter(p => p.category === category);
}

export function getProjectsByStatus(status) {
    return projects.filter(p => p.status === status);
}

export function getProjectsByTech(tech) {
    return projects.filter(p => p.tech.includes(tech));
}

// Project categories
export const categories = [
    'All Projects',
    'Web Application',
    'Machine Learning',
    'Creative/AI',
    'Research'
];

// Project statuses
export const statuses = [
    'Completed',
    'In Progress',
    'Archived'
];

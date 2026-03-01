# ETHIO🛍   Ethiopian Marketplace & Job Platform

## Overview
A mobile-optimized web application designed as a Telegram Mini App that serves as a marketplace and job listing platform. The app features a single-page layout optimized for full-screen mode in Telegram WebApp environments with Ethiopian-inspired design elements and enhanced visual identity. The application includes Capacitor configuration for Android APK build support.

## Core Features

### Home/Discover Section
- Featured products display with large image cards
- Top Viewing Items collection displayed as a horizontal scrolling carousel or grid showing the most viewed products from all categories, positioned directly below the hero banner
- Product categories showcase
- Quick navigation to marketplace, job sections, categories, and user features
- Minimalist splash screen with solid dark background (solid black or deep charcoal), centered app title, and horizontal progress bar positioned at the bottom edge - clean design without logo or image overlays

### Marketplace
- Product listing grid with title, price, image, and short description
- Search functionality across products
- Filter options for categories and price ranges including Cars and Bikes categories
- Product detail view with full description and seller information
- Product view tracking that increments view count each time a product is viewed
- Favorite/unfavorite functionality for logged-in users

### Product Details Page
- Dedicated page displaying complete product information including image carousel, title, description, price, category, seller information, and view count
- Automatically calls backend incrementProductViews function when page is opened to track product views
- Functional Message Seller button that opens messaging interface with the product seller
- Add to Favorites button for logged-in users to save products to wishlist
- Buy Now button (placeholder functionality for future implementation)
- Proper routing integration allowing navigation from product listings and smooth back navigation
- Accessible from View buttons on homepage Top Viewing Items carousel, Marketplace listings, and Seller Listings pages

### Categories Page
- Visual display of all product categories as interactive tiles including Cars and Bikes
- Uses Ethiopian-themed category images as navigation elements
- Leads to category-filtered product grids
- Touch-optimized tile layout

### Seller Listings
- Personal seller dashboard showing user's own uploaded products
- "Add New Product" button that opens a modal/form for product creation
- Product creation form with fields for title, price, description, category (including Cars and Bikes options), and image upload
- Edit and delete options for own products
- Public storefront view for other sellers
- Seller contact information display
- Product collections organized by seller
- Dynamic updates when new products are added

### Messaging System
- One-on-one chat between buyers and sellers
- Minimal Telegram-style UI with message list and input bar
- Message timestamps and delivery status
- Chat history persistence

### Favorites (Wishlist)
- Dedicated page for logged-in users to view favorited products
- Quick unfavorite and buy now actions
- Persistent wishlist across sessions

### Job Listings
- Simple list view of available jobs
- Display job title, location, and company
- Apply button for each job listing
- Basic job filtering by location or category

### Profile/Account
- User authentication via Internet Identity with proper authentication check logic
- User profile management with signup functionality for name, email, and phone number
- Login/logout functionality
- Account settings

## Technical Requirements

### Telegram Integration
- Full-screen mode optimization for Telegram WebApp
- Integration with Telegram WebApp.initData and WebApp.expand
- Responsive design for both landscape and portrait orientations
- Fixed bottom taskbar with all navigation icons and labels on a single horizontal line with even spacing and responsive sizing

### Capacitor Android Configuration
- Capacitor configuration file (capacitor.config.ts) with Android platform support
- Server URL configuration pointing to deployed web app with androidScheme set to "https"
- Android resource directories with app icons, splash screens, and adaptive launcher icons
- AndroidManifest.xml with full-screen activity, portrait orientation, internet permissions, and Telegram WebApp compatibility (usesCleartextTraffic enabled)
- Gradle build files for Android project setup
- Setup instructions for Capacitor CLI commands (npx cap add android, npx cap open android)
- Android splash screen and theme colors matching ETHIO🛍 dark design (black background, white text, bottom progress bar)

### Design & UX
- Enhanced Ethiopian-inspired styling with warm earthy tones
- Polished typography with improved font hierarchy
- Animated transitions between sections and UI elements
- Redesigned button styles and iconography
- Improved layout spacing and visual dynamics
- Mobile-first responsive design optimized for Telegram Mini App
- Smooth navigation with enhanced slide-in panels or bottom tabs
- Touch-optimized interface elements
- Subtle UI polish consistent with ETHIO🛍 theme for splash screen and navigation layouts
- Clean minimalist splash screen with solid dark background, centered app title only, and bottom-positioned horizontal progress bar - no logo or image overlays
- App content language: English

### Data Storage
The backend must store:
- Product listings with details, images, prices, seller information, unique auto-generated IDs, creation timestamps, view counts, and categories including Cars and Bikes
- Job postings with titles, descriptions, locations, and company details
- User profiles with name, email, phone number, and authentication data
- Product categories including Cars and Bikes categories
- User favorites/wishlist data
- Chat messages and conversation threads between users
- Seller storefront information and contact details

### Backend Operations
- User authentication and profile management with proper Internet Identity integration
- User profile registration functionality that creates UserProfile records with caller's Principal, name, email, phone number, and timestamp
- User profile retrieval for currently logged-in users
- Product creation functionality for authenticated sellers with auto-generated unique IDs, seller assignment as caller, creation timestamp, and support for Cars and Bikes categories
- Product CRUD operations (create, read, update, delete) with proper category handling
- Product view tracking with incrementProductViews function that increases view count when products are accessed
- Query method to retrieve top viewed products sorted by view count with configurable limit
- Query methods to list all products and fetch products by specific seller with category filtering
- Job listing CRUD operations
- Search and filtering functionality for both products and jobs including Cars and Bikes categories
- User session management
- Favorites/wishlist management (add, remove, retrieve user favorites)
- Messaging system (send, receive, retrieve chat history)
- Seller storefront management and public profile access
- Proper error handling for anonymous callers with descriptive messages
- ProductCategory enum support for Cars and Bikes with proper comparison functions

## User Interface
- Single-page application with enhanced section-based navigation
- Fixed bottom tab navigation with all icons and labels on single horizontal line, even spacing, and responsive sizing for Telegram full-screen mode
- Full-screen modal for authentication
- Product creation modal/form with input fields for title, price, description, category (including Cars and Bikes options), and image upload functionality
- Responsive grid layouts for product and job displays
- Top Viewing Items section on homepage with horizontal scrolling carousel or grid layout, dynamically updated with React Query
- Clean minimalist splash screen with solid dark background, centered app title only, and bottom-positioned horizontal progress bar - no logo or image elements
- Polished UI components with improved visual hierarchy
- Animated transitions and micro-interactions throughout the interface
- Dynamic UI updates when new products are created and added to listings
- Category tiles for Cars and Bikes in the categories page with appropriate Ethiopian marketplace styling
- Product Details Page with proper routing integration and functional View buttons throughout the application that navigate to detailed product views

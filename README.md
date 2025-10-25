🍽️ DineDelight Restaurant Website
A modern, full-stack web application for a restaurant, enabling menu browsing, table reservations, user authentication, and online food ordering.

✨ Features
User Management: Secure registration and login.

Interactive Menu: Dynamic display of food items from the database.

Table Booking: Easy online reservations.

Online Ordering: Seamless food ordering with cart functionality.

Modern Design: Responsive UI with engaging animations.

🚀 Technologies
Frontend: React.js, Tailwind CSS, React Context API.
Backend: Node.js, Express.js, MongoDB (via Mongoose), bcryptjs, JSON Web Tokens (JWT).

📋 Prerequisites
Node.js & npm (or Yarn)

MongoDB Atlas account or local MongoDB instance

⚙️ Setup & Run
1. Backend
Clone: git clone <your-repository-url>

Navigate: cd restaurant-backend

Install: npm install (or yarn install)

.env File: Create .env in restaurant-backend with:

PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=YOUR_VERY_STRONG_RANDOM_SECRET_KEY_HERE

(Replace placeholders with your actual MongoDB Atlas connection string and a strong secret.)

Start: npm start (or node app.js)

Populate DB (Optional): Add sample MenuItem documents to your menuitems collection in MongoDB.

2. Frontend
Navigate: cd ../restaurant-frontend

Install: npm install (or yarn install)

Configure index.html: Ensure restaurant-frontend/index.html (at project root) contains the Tailwind CDN, Google Fonts, and custom animation styles directly within the <head> section. (Refer to the full index.html content in previous instructions if needed).

Start: npm run dev (or npm start)

🚀 Usage
Register/Login: Access via the navigation bar.

Explore: Browse "Menu," "Reservations," and "Order Online" sections.

🤝 Contributing
Fork, pull requests, or issues are welcome.

📄 License

ISC License.

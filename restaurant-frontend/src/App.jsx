import React, { useState, useEffect, createContext, useContext } from 'react';

// Context for user authentication state
const AuthContext = createContext(null);

// Custom hook for authentication
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to manage authentication state
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set user and token from API response
  const setAuthData = (token, userData) => {
    localStorage.setItem('token', token);
    setUser({ id: userData._id, username: userData.username, email: userData.email });
  };

  // Login function - NOW USING ACTUAL API CALL
  const login = async (email, password) => { // Changed username to email for backend compatibility
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setAuthData(data.token, data);
        return true;
      } else {
        console.error('Login failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Register function - NOW USING ACTUAL API CALL
  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setAuthData(data.token, data); // Auto-login after successful registration
        return true;
      } else {
        console.error('Registration failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Effect to check for existing token and fetch user data on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5001/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();

          if (response.ok) {
            setUser({ id: data._id, username: data.username, email: data.email });
          } else {
            console.error('Token validation failed:', data.message);
            localStorage.removeItem('token'); // Invalid token, remove it
            setUser(null);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on mount

  const value = { user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Icon components (using inline SVG for simplicity or lucide-react if available)
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

// Navigation Bar Component
const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleNavLinkClick = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <nav className="bg-gradient-to-r from-yellow-800 to-black p-4 shadow-xl rounded-b-xl animate-fadeInDown">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-4xl font-extrabold font-inter tracking-wide transform hover:scale-105 transition-transform duration-300">
          <span className="text-orange-400">Dine</span>Delight
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <NavLink icon={<HomeIcon />} text="Home" page="home" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          <NavLink icon={<MenuIcon />} text="Menu" page="menu" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          <NavLink icon={<CalendarIcon />} text="Reservations" page="reservations" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          <NavLink icon={<ShoppingCartIcon />} text="Order Online" page="order" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          {user ? (
            <button
              onClick={() => { logout(); handleNavLinkClick('home'); }}
              className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-300 transform hover:scale-105 px-3 py-2 rounded-lg bg-yellow-900 hover:bg-yellow-800 shadow-md"
            >
              <UserIcon />
              <span>Logout ({user.username})</span>
            </button>
          ) : (
            <NavLink icon={<UserIcon />} text="Login" page="login" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          )}
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <MenuIcon />
          </button>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 bg-opacity-95 text-white flex flex-col items-center space-y-4 py-4 animate-slideInDownFast">
          <NavLink icon={<HomeIcon />} text="Home" page="home" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          <NavLink icon={<MenuIcon />} text="Menu" page="menu" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          <NavLink icon={<CalendarIcon />} text="Reservations" page="reservations" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          <NavLink icon={<ShoppingCartIcon />} text="Order Online" page="order" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          {user ? (
            <button
              onClick={() => { logout(); handleNavLinkClick('home'); }}
              className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-300 transform hover:scale-105 px-3 py-2 rounded-lg bg-yellow-900 hover:bg-yellow-800 shadow-md w-full text-center justify-center"
            >
              <UserIcon />
              <span>Logout ({user.username})</span>
            </button>
          ) : (
            <NavLink icon={<UserIcon />} text="Login" page="login" currentPage={currentPage} setCurrentPage={handleNavLinkClick} />
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ icon, text, page, currentPage, setCurrentPage }) => (
  <button
    onClick={() => setCurrentPage(page)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105
      ${currentPage === page ? 'bg-orange-400 text-black shadow-lg' : 'text-white hover:bg-yellow-800 hover:text-orange-400'}`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

// Home Page Component
const HomePage = ({ setCurrentPage }) => {
  // Directly use the provided image URL
  const staticBackgroundImage = 'https://t3.ftcdn.net/jpg/02/28/28/16/360_F_228281605_zX4rGhhAX6fNkBgx7dp1IXu8XMnhCl01.jpg';

  return (
    // Outermost div for full width background and full height
    <div className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
         style={{ backgroundImage: `url('${staticBackgroundImage}')` }}>
      {/* Dark overlay for text readability, always present */}
      <div className="absolute inset-0 bg-black opacity-70 animate-fadeIn"></div>
      {/* Inner div for content, applying container for max-width and centering */}
      <div className="relative z-10 container mx-auto p-6 flex flex-col items-center justify-center text-white text-center bg-black bg-opacity-40 rounded-xl shadow-2xl animate-scaleIn max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg font-inter animate-slideInUp">
          Welcome to <span className="text-orange-400">Dine</span>Delight
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed animate-fadeIn delay-300">
          Experience exquisite dining, delightful flavors, and unforgettable moments.
          Taste the tradition, savor the innovation.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn delay-500">
          <button
            onClick={() => setCurrentPage('reservations')}
            className="bg-orange-400 text-black font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-110 text-lg border-2 border-orange-400 hover:border-black"
          >
            Reserve a Table
          </button>
          <button
            onClick={() => setCurrentPage('order')}
            className="bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 text-lg border-2 border-white hover:border-orange-400"
          >
            Order Online
          </button>
        </div>
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = ({ setCurrentPage }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const success = await login(email, password);
    if (success) {
      setCurrentPage('home');
    } else {
      setError(error.message || 'Invalid email or password.'); // Use data.message from backend
    }
    setIsSubmitting(false);
  };

  return (
    // Outer div for full width background and full height
    <div className="w-full min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center p-4 animate-fadeIn">
      {/* Inner div for content, applying container for max-width and centering */}
      <div className="container mx-auto bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 transform hover:scale-105 transition-transform duration-300 animate-slideInRight">
        <h2 className="text-4xl font-bold text-center text-yellow-900 mb-8 font-inter">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-orange-600 text-sm text-center animate-shake">{error}</p>} {/* Changed error text color */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold text-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6 text-md">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-orange-600 hover:underline font-medium transition-colors duration-200"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

// Register Page Component
const RegisterPage = ({ setCurrentPage }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    const success = await register(username, email, password);
    if (success) {
      setCurrentPage('home');
    } else {
      setError(error.message || 'Registration failed. Please try again.'); // Use data.message from backend
    }
    setIsSubmitting(false);
  };

  return (
    // Outer div for full width background and full height
    <div className="w-full min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center p-4 animate-fadeIn">
      {/* Inner div for content, applying container for max-width and centering */}
      <div className="container mx-auto bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 transform hover:scale-105 transition-transform duration-300 animate-slideInLeft">
        <h2 className="text-4xl font-bold text-center text-yellow-900 mb-8 font-inter">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="reg-username">
              Username
            </label>
            <input
              type="text"
              id="reg-username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="reg-email">
              Email
            </label>
            <input
              type="email"
              id="reg-email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="reg-password">
              Password
            </label>
            <input
              type="password"
              id="reg-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-orange-600 text-sm text-center animate-shake">{error}</p>} {/* Changed error text color */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold text-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6 text-md">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-orange-600 hover:underline font-medium transition-colors duration-200"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

// Mock Menu Data (will be replaced by API call)
const menuItems = [
  {
    category: 'Appetizers',
    items: [
      { id: 'app1', name: 'Crispy Calamari', description: 'Served with spicy marinara sauce.', price: 12.99, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Calamari' },
      { id: 'app2', name: 'Bruschetta', description: 'Toasted bread with fresh tomatoes, basil, and balsamic glaze.', price: 9.50, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Bruschetta' },
      { id: 'app3', name: 'Spinach Artichoke Dip', description: 'Creamy dip served with warm tortilla chips.', price: 11.75, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Dip' },
    ],
  },
  {
    category: 'Main Courses',
    items: [
      { id: 'main1', name: 'Grilled Salmon', description: 'With roasted asparagus and lemon-dill sauce.', price: 24.99, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Salmon' },
      { id: 'main2', name: 'Ribeye Steak', description: '12oz prime ribeye, mashed potatoes, and seasonal vegetables.', price: 32.50, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Steak' },
      { id: 'main3', name: 'Vegetable Lasagna', description: 'Layers of pasta, ricotta, mozzarella, and fresh vegetables.', price: 18.99, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Lasagna' },
      { id: 'main4', name: 'Chicken Alfredo', description: 'Fettuccine pasta tossed in creamy Alfredo sauce with grilled chicken.', price: 20.75, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Alfredo' },
    ],
  },
  {
    category: 'Desserts',
    items: [
      { id: 'des1', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.', price: 8.99, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Lava+Cake' },
      { id: 'des2', name: 'New York Cheesecake', description: 'Classic cheesecake with berry compote.', price: 7.50, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Cheesecake' },
    ],
  },
  {
    category: 'Beverages',
    items: [
      { id: 'bev1', name: 'Fresh Orange Juice', description: 'Freshly squeezed.', price: 4.00, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Orange+Juice' },
      { id: 'bev2', name: 'Espresso', description: 'Rich, strong coffee.', price: 3.50, imageUrl: 'https://placehold.co/400x300/FEE2E2/B91C1C?text=Espresso' },
    ],
  },
];

// Menu Page Component
const MenuPage = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5001/api/menu');
        console.log('Menu API Response Status:', response.status); // Debugging
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Menu API Data:', data); // Debugging

        // Group data by category for display
        const groupedData = data.reduce((acc, item) => {
          const category = item.category || 'Uncategorized'; // Handle items without a category
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});

        // Convert the grouped object back to an array of { category: string, items: [] } for consistent rendering
        const finalMenuData = Object.keys(groupedData).map(category => ({
          category: category,
          items: groupedData[category]
        }));

        setMenuData(finalMenuData); // Set the grouped data
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
        console.error('Error fetching menu:', err);
        // Fallback to mock data if API fails to avoid blank page
        setMenuData(menuItems); // Keep original mock data as fallback
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <div className="text-center text-3xl p-12 text-gray-700 animate-pulse">Loading delicious menu...</div>;
  if (error) return <div className="text-center text-3xl p-12 text-red-600 animate-shake">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 flex-grow animate-fadeIn">
      <h1 className="text-5xl font-extrabold text-center text-yellow-800 mb-12 font-inter animate-slideInDown">Our Delicious Menu</h1>
      {menuData.map((categoryData) => (
        <div key={categoryData.category} className="mb-12 border-b-4 border-orange-400 pb-8 animate-fadeInUp">
          <h2 className="text-4xl font-bold text-orange-700 mb-8 pb-2 text-center md:text-left animate-slideInRight">
            {categoryData.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Corrected: map over categoryData.items directly */}
            {categoryData.items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200 animate-zoomIn">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover object-center transition-transform duration-300 hover:scale-110"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/FEE2E2/B91C1C?text=${encodeURIComponent(item.name)}`; }}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-lg mb-4">{item.description}</p>
                  <p className="text-orange-700 text-3xl font-extrabold">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Reservation Page Component
const ReservationPage = () => {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please log in to make a reservation.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token'); // Get token
      const response = await fetch('http://localhost:5001/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token
        },
        body: JSON.stringify({ date, time, guests }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(`Reservation for ${guests} guests on ${date} at ${time} confirmed!`);
        setDate('');
        setTime('');
        setGuests(1);
      } else {
        throw new Error(data.message || 'Failed to make reservation');
      }

    } catch (error) {
      setMessage(`Error: ${error.message || 'Could not make reservation.'}`);
      console.error('Reservation submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    // Outer div for full width background and full height
    <div className="w-full min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center p-4 animate-fadeIn">
      {/* Inner div for content, applying container for max-width and centering */}
      <div className="container mx-auto bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 animate-slideInRight">
        <h2 className="text-4xl font-bold text-center text-yellow-900 mb-8 font-inter">Reserve Your Table</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="res-date">
              Date
            </label>
            <input
              type="date"
              id="res-date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayDate()} // Prevent selecting past dates
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="res-time">
              Time
            </label>
            <input
              type="time"
              id="res-time"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min="17:00" // Example: Restaurant opens at 5 PM
              max="22:00" // Example: Last reservation at 10 PM
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="res-guests">
              Number of Guests
            </label>
            <input
              type="number"
              id="res-guests"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              min="1"
              max="10" // Max guests per reservation
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold text-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Reservation'}
          </button>
        </form>
        {message && (
          <p className={`mt-6 text-center text-lg ${user && !message.startsWith('Error') ? 'text-green-600' : 'text-red-600'} animate-fadeIn`}>
            {message}
          </p>
        )}
        {!user && (
          <p className="text-center text-gray-600 mt-4 text-md">
            You need to be logged in to make a reservation.
          </p>
        )}
      </div>
    </div>
  );
};

// Order Page Component
const OrderPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'pickup'
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuData, setMenuData] = useState([]); // State for actual menu data
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [menuError, setMenuError] = useState(null);


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        setMenuError(null);
        const response = await fetch('http://localhost:5001/api/menu');
        console.log('OrderPage Menu API Response Status:', response.status); // Debugging
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('OrderPage Menu API Data:', data); // Debugging

        // Group data by category for display
        const groupedData = data.reduce((acc, item) => {
          const category = item.category || 'Uncategorized'; // Handle items without a category
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});

        // Convert the grouped object back to an array of { category: string, items: [] } for consistent rendering
        const finalMenuData = Object.keys(groupedData).map(category => ({
          category: category,
          items: groupedData[category]
        }));

        setMenuData(finalMenuData); // Set the grouped data
      } catch (err) {
        setMenuError('Failed to load menu for ordering. Please try again later.');
        console.error('Error fetching menu for order:', err);
        // Fallback to mock data if API fails
        setMenuData(menuItems); // Use original mock data as fallback
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);


  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    setMessage(`${item.name} added to cart!`);
    setTimeout(() => setMessage(''), 2000);
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please log in to place an order.');
      return;
    }
    if (cart.length === 0) {
      setMessage('Your cart is empty. Please add items to order.');
      return;
    }
    if (orderType === 'delivery' && !address) {
      setMessage('Please enter your delivery address.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Prepare items for backend (only send ID and quantity)
      console.log(cart);
      const itemsForBackend = cart.map(item => ({
        menuItemId: item._id, // Assuming item._id matches backend's _id
        quantity: item.quantity
      }));

      const token = localStorage.getItem('token'); // Get token
      const response = await fetch('http://localhost:5001/api/orders', { // Uncommented API call
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token
        },
        body: JSON.stringify({
          items: itemsForBackend,
          orderType,
          deliveryAddress: orderType === 'delivery' ? address : undefined,
        }),
      });
      console.log('Order API Response:', response); // Debugging
      const data = await response.json();
      console.log('Order API Response Data:', data); // Debugging

      if (response.ok) {
        setMessage(`Order placed successfully! Total: ₹${calculateTotal()}. You will receive a confirmation shortly.`);
        setCart([]);
        setAddress('');
      } else {
        throw new Error(data.message || 'Failed to place order');
      }

    } catch (error) {
      setMessage(`Error: ${error.message || 'Could not place order.'}`);
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000); // Clear message after a delay
    }
  };

  if (loadingMenu) return <div className="text-center text-3xl p-12 text-gray-700 animate-pulse">Loading menu for ordering...</div>;
  if (menuError) return <div className="text-center text-3xl p-12 text-red-600 animate-shake">{menuError}</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 flex-grow flex flex-col lg:flex-row gap-8 animate-fadeIn">
      <div className="lg:w-2/3">
        <h1 className="text-5xl font-extrabold text-center text-yellow-800 mb-12 font-inter animate-slideInDown">Order Online</h1>
        {menuData.map((categoryData) => (
          <div key={categoryData.category} className="mb-10 border-b-2 border-orange-400 pb-6 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-orange-700 mb-6 pb-2 text-center md:text-left animate-slideInRight">
              {categoryData.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Corrected: map over categoryData.items directly */}
              {categoryData.items.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden flex items-center p-4 transform hover:scale-105 transition-all duration-300 border border-gray-200 animate-zoomIn">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover object-center rounded-lg mr-4 transition-transform duration-300 hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/FEE2E2/B91C1C?text=${encodeURIComponent(item.name)}`; }}
                  />
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <p className="text-orange-700 text-2xl font-extrabold">₹{item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-orange-700 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition-colors duration-300 shadow-md transform hover:scale-105"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-2xl border border-gray-200 sticky top-4 h-fit animate-slideInRight">
        <h2 className="text-3xl font-bold text-center text-yellow-800 mb-6 font-inter">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500 animate-fadeIn">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-4 mb-6">
              {cart.map((item) => (
                <li key={item._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm animate-fadeIn">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-100 text-red-600 p-1 rounded-md hover:bg-red-200 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center text-2xl font-bold text-gray-900 mb-6 border-t pt-4">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-lg font-medium mb-2">Order Type</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-orange-600 h-5 w-5"
                      name="orderType"
                      value="delivery"
                      checked={orderType === 'delivery'}
                      onChange={() => setOrderType('delivery')}
                    />
                    <span className="ml-2 text-gray-700">Delivery</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-orange-600 h-5 w-5"
                      name="orderType"
                      value="pickup"
                      checked={orderType === 'pickup'}
                      onChange={() => setOrderType('pickup')}
                    />
                    <span className="ml-2 text-gray-700">Pickup</span>
                  </label>
                </div>
              </div>
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="address">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 text-lg transition-all duration-200"
                    rows="3"
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required={orderType === 'delivery'}
                  ></textarea>
                </div>
              )}
              {message && (
                <p className={`text-center text-md ${user && !message.startsWith('Error') ? 'text-green-600' : 'text-red-600'} animate-fadeIn`}>
                  {message}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold text-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};


// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Tailwind CSS setup - NO LONGER DYNAMICALLY INJECTED
  // These are now expected to be in public/index.html for immediate loading.
  // This useEffect block has been completely removed as it was causing parsing issues.
  // Ensure your index.html file has the Tailwind CDN and custom styles directly.

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'menu':
        return <MenuPage />;
      case 'reservations':
        return <ReservationPage />;
      case 'order':
        return <OrderPage />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      {/* Added w-screen and min-w-screen to ensure the App container takes full viewport width */}
      <div className="App bg-gray-900 min-h-screen flex flex-col w-screen min-w-screen">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-grow"> {/* This div will take up remaining vertical space */}
          {renderPage()}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

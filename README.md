# 🚀 Crypto Alert System

A production-ready cryptocurrency alert system with real-time price monitoring, browser notifications, and professional UI. Built with React + LunarCrush API for modern portfolio demonstration.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)](https://vitejs.dev/)
[![Mantine](https://img.shields.io/badge/Mantine-8.2.1-blue?logo=mantine)](https://mantine.dev/)
[![LunarCrush](https://img.shields.io/badge/LunarCrush-API-orange)](https://lunarcrush.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://crypto-alert-system.pages.dev/)

## 🎯 Portfolio Highlights

**Perfect for demonstrating modern frontend and real-time system skills:**

- 🔔 **Real-Time Alerts**: Browser notifications with 11 alert types
- 📊 **Live Crypto Data**: Bitcoin and Ethereum market metrics via LunarCrush API
- 🎨 **Professional UI**: Mantine 8.2.1 with glassmorphism design and dark theme
- 📱 **Mobile-First**: Responsive design optimized for all devices
- ⚡ **Performance**: Zustand + React Query for optimal state management
- 🏗️ **Production-Ready**: Professional dependency management and error handling

---

## 🚀 Live Demo

**Try it now:** [Crypto Alert System](https://crypto-alert-system.pages.dev/)

**Features to test:**
- View live Bitcoin and Ethereum metrics
- Create price alerts with browser notifications
- Experience professional glassmorphism UI
- Test mobile responsive design

---

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern hooks and concurrent features
- **Vite 5** - Lightning-fast development and optimized builds
- **Mantine 8.2.1** - Professional component library with consistent theming
- **Zustand 4.4.7** - Lightweight state management with persistence

### **Data & APIs**

- **LunarCrush API** - Real-time cryptocurrency and social sentiment data
- **React Query 5** - Smart data fetching with caching and background updates
- **Cloudflare Workers** - Serverless backend with global edge deployment

### **UI & UX**

- **Tabler Icons** - Comprehensive icon system
- **Recharts** - Professional data visualization
- **Browser Notifications** - Native OS integration
- **Glassmorphism** - Modern backdrop blur effects

---

## 🎯 Key Features

### **🔥 Real-Time Price Monitoring**

- Live Bitcoin, Ethereum, and cryptocurrency prices
- 30-second polling with pause/resume functionality
- Connection status monitoring with automatic reconnection

### **🚨 Smart Alert System**

- **11 Alert Types**: Price thresholds, volume spikes, sentiment changes
- **Browser Notifications**: Native OS notifications with sound
- **Persistent Storage**: Alerts survive browser restarts
- **Real-time Monitoring**: Continuous price comparison with smart triggering

### **📊 Professional Dashboard**

- **Live Price Cards**: Bitcoin and  Ethereum with 24h changes
- **Market Metrics**: Volume, market cap, percentage changes
- **Alert Management**: Create, view, disable, and delete alerts
- **Error Recovery**: Production-ready error boundaries and user feedback

### **🎨 Modern User Experience**

- **Glassmorphism Design**: Backdrop blur effects and gradient backgrounds
- **Dark Theme**: Cohesive professional dark mode throughout
- **Mobile Responsive**: Touch-optimized for all device sizes
- **Smooth Animations**: Loading states, transitions, and micro-interactions

---

## 🏗️ Architecture

```bash
┌─ Frontend (React + Vite) ───┐    ┌─ Real-Time Data ─┐
│                             │    │                  │
│  HeroSection                │◄──►│  LunarCrush API  │
│  ├─ Live Bitcoin Price     │    │  Crypto Data     │
│  ├─ Ethereum Updates       │    │                  │
│  └─ Alert Counter          │    └──────────────────┘
│                             │              ▲
│  DashboardGrid             │              │
│  ├─ Crypto Cards           │              │
│  ├─ Real-time Updates      │              │
│  └─ Connection Status      │              │
│                             │              │
│  AlertModal                │              │
│  ├─ 11 Alert Types         │              │
│  ├─ Notification Setup     │              │
│  └─ Persistent Storage     │              │
│                             │              │
└─────────────┬───────────────┘              │
              │                              │
              ▼                              │
┌─ State Management (Zustand) ┐              │
│                             │              │
│  useCryptoStore             │──────────────┘
│  ├─ Real-time Data         │
│  ├─ Connection Status      │
│  └─ Error Handling         │
│                             │
│  useAlertStore             │
│  ├─ Alert Management       │
│  ├─ Browser Notifications  │
│  └─ Local Storage          │
│                             │
└─────────────────────────────┘
```

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+
- Modern browser with notification support
- Basic React knowledge

### **Installation**

```bash
# Clone the repository
git clone https://github.com/danilobatson/crypto-alert-system.git
cd crypto-alert-system

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### **Environment Variables**

```env
# .env.local (Demo configuration included)
VITE_API_BASE_URL=https://cryptoguard-api.cryptoguard-api.workers.dev
VITE_API_KEY=demo_tutorial_001
VITE_MODE=production
```

### **Production Build**

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```bash
crypto-alert-system/
├── 📄 README.md
├── 📦 package.json
├── ⚙️ vite.config.js
├── 🔐 .env.local
│
├── 📁 src/
│   ├── 🏠 App.jsx                  # Main application component
│   │
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── 🎯 HeroSection.jsx  # Professional hero with live prices
│   │   │   └── 🦶 Footer.jsx       # App footer with credits
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   ├── 📊 DashboardGrid.jsx # Main crypto dashboard
│   │   │   └── 💰 CryptoCard.jsx    # Individual crypto price cards
│   │   │
│   │   ├── 📁 alerts/
│   │   │   ├── 🚨 AlertModal.jsx    # Alert creation modal
│   │   │   ├── 📋 AlertsList.jsx    # Alert management interface
│   │   │   └── 🔔 AlertForm.jsx     # Alert configuration form
│   │   │
│   │   └── 📁 ui/
│   │       ├── 📢 NotificationBanner.jsx
│   │       └── 🛡️ ErrorBoundary.jsx
│   │
│   ├── 📁 stores/
│   │   ├── 💎 useCryptoStore.js     # Cryptocurrency data state
│   │   └── 🚨 useAlertStore.js      # Alert system state
│   │
│   ├── 📁 hooks/
│   │   ├── 📊 useCryptoData.js      # Real-time data fetching
│   │   ├── 🔔 useNotifications.js   # Browser notification handling
│   │   └── ⚡ useAlertInitialization.js # Alert persistence
│   │
│   └── 📁 api/
│       └── 🌐 cryptoApi.js          # LunarCrush API integration
│
└── 📁 public/
    ├── 🖼️ favicon.ico
    └── 📋 index.html
```

---

## 🎨 Features Showcase

### **Real-Time Alert Creation**

```javascript
// Alert configuration with 11 types
const alertTypes = {
  'price_above': 'Price Above Threshold',
  'price_below': 'Price Below Threshold',
  'volume_spike': 'Volume Spike Alert',
  'sentiment_high': 'Positive Sentiment',
  'sentiment_low': 'Negative Sentiment',
  'galaxy_score': 'Galaxy Score Alert',
  'altrank_rising': 'AltRank Rising',
  'market_cap': 'Market Cap Threshold',
  'social_volume': 'Social Volume Spike',
  'price_change': 'Price Change Alert',
  'custom': 'Custom Conditions'
};
```

### **Browser Notification Integration**

```javascript
// Native browser notification system
const triggerNotification = (alert, currentPrice) => {
  if (Notification.permission === 'granted') {
    new Notification(`🚨 ${alert.title}`, {
      body: `${alert.symbol.toUpperCase()} hit $${currentPrice.toLocaleString()}`,
      icon: '/favicon.ico',
      tag: `alert-${alert.id}`
    });
  }
};
```

### **Real-Time Data Management**

```javascript
// Zustand store with React Query integration
const useCryptoStore = create((set, get) => ({
  cryptoData: {},
  isPolling: true,
  connectionStatus: 'connected',

  updateCryptoData: (data) => set(state => ({
    cryptoData: { ...state.cryptoData, ...data }
  })),

  togglePolling: () => set(state => ({
    isPolling: !state.isPolling
  }))
}));
```

---

## 🚀 Deployment

### **Cloudflare Pages (Current)**

```bash
# Already deployed at:
# https://crypto-alert-system.pages.dev/

# Deployment configuration:
Framework: Vite
Build command: npm run build
Output directory: dist
Node.js version: 18
```

### **Environment Variables for Production**

```env
VITE_API_BASE_URL=https://cryptoguard-api.cryptoguard-api.workers.dev
VITE_API_KEY=demo_tutorial_001
VITE_MODE=production
```

### **Alternative Deployment Options**

- **Vercel**: One-click deployment with GitHub integration
- **Netlify**: Drag-and-drop build folder deployment
- **Railway**: Full-stack deployment with environment variables

---

## 💼 Portfolio Value

### **Technical Achievements**

- ✅ **Real-Time Systems**: 30-second polling with connection management
- ✅ **State Management**: Complex Zustand + React Query architecture
- ✅ **Browser APIs**: Native notification integration with permission handling
- ✅ **Error Recovery**: Production-ready error boundaries and user feedback
- ✅ **Responsive Design**: Mobile-first approach with glassmorphism effects
- ✅ **Dependency Management**: Professional Mantine 8.2.1 upgrade and resolution

### **Business Value**

- 🎯 **Real-World Application**: Solves actual cryptocurrency monitoring needs
- 📊 **Financial Data**: Integration with live market data and social sentiment
- 🔔 **User Engagement**: Browser notifications increase user retention
- 📱 **Mobile Experience**: Touch-optimized for mobile crypto traders
- ⚡ **Performance**: Optimized bundle size and loading times

### **Interview Talking Points**

- **Real-time Data**: Implemented polling strategy with pause/resume functionality
- **State Management**: Chose Zustand over Redux for performance and simplicity
- **Error Handling**: Comprehensive error boundaries with user-friendly recovery
- **Performance**: Bundle optimization and efficient re-rendering strategies
- **User Experience**: Progressive enhancement with notification permissions

---

## 🧪 Testing

### **Manual Testing Checklist**

```bash
# Live Demo Testing
✅ Visit: https://crypto-alert-system.pages.dev/
✅ Verify Bitcoin price shows ~$119,000+
✅ Create a price alert above current price
✅ Enable browser notifications
✅ Test mobile responsive design
✅ Verify connection status indicator
✅ Test auto-refresh toggle functionality
```

### **Development Testing**

```bash
# Local development testing
npm run dev

# Production build testing
npm run build
npm run preview
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[LunarCrush](https://lunarcrush.com)** - Real-time cryptocurrency and social sentiment data
- **[Mantine](https://mantine.dev)** - Professional React component library
- **[Tabler Icons](https://tabler-icons.io)** - Comprehensive icon system
- **[Cloudflare Pages](https://pages.cloudflare.com)** - Global deployment and edge optimization

---

## 📞 Contact

**Danilo Jamaal** - Software Engineer
📧 [djbatson19@gmail.com](mailto:djbatson19@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/danilo-batson)
🌐 [Portfolio](https://danilobatson.github.io/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/danilobatson/crypto-alert-system?style=social)](https://github.com/danilobatson/crypto-alert-system/stargazers)

**🚀 Ready to build your own? [Fork this repository](https://github.com/danilobatson/crypto-alert-system/fork) and deploy to Cloudflare Pages in minutes!**

</div>

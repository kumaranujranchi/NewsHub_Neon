# Hindi News Hub 🇮🇳

A modern, responsive Hindi news website built with React, TypeScript, and Vite. Stay informed with the latest news across all major categories in Hindi.

## 🌟 Features

- **Modern UI/UX**: Clean, responsive design optimized for Hindi content
- **Real-time News**: Latest news across multiple categories
- **Search Functionality**: Advanced search with filters
- **Content Management**: Admin panel for managing articles and content
- **User Authentication**: Secure login system for editors and admins
- **Mobile Responsive**: Optimized for all device sizes
- **SEO Optimized**: Built with performance and search engine optimization in mind

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Neon
- **Authentication**: JWT-based authentication
- **Deployment**: Netlify with serverless functions
- **ORM**: Drizzle ORM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kumaranujranchi/NewsHub_Neon.git
   cd NewsHub_Neon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials and other configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Backend Express server
│   ├── db.ts             # Database configuration
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data access layer
├── shared/               # Shared types and utilities
├── netlify/             # Netlify Functions
│   └── functions/       # Serverless API endpoints
├── netlify.toml         # Netlify configuration
└── DEPLOYMENT.md        # Deployment guide
```

## 🌐 Deployment

This project is configured for deployment on Netlify with Neon PostgreSQL database.

### Deploy to Netlify

1. **Connect your repository** to Netlify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/client`
   - Functions directory: `netlify/functions`

3. **Set environment variables** in Netlify dashboard
4. **Deploy** and enjoy your live Hindi news website!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📝 Environment Variables

Required environment variables:

```env
DATABASE_URL=your_neon_database_url
NODE_ENV=production
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

See `.env.example` for the complete list.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for the Hindi-speaking community
- Optimized for performance and accessibility

## 📞 Support

For support, email [your-email@example.com] or create an issue in this repository.

---

**Made with ❤️ for the Hindi community**
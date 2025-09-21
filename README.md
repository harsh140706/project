# 🚀 Career Advice Application

A modern, AI-powered career guidance platform that provides personalized career recommendations, detailed education pathways, and comprehensive skill development plans.

## ✨ Features

- **🎯 Personalized Career Advice**: Get tailored recommendations based on your interests and goals
- **📚 Detailed Education Pathways**: Comprehensive degree information including duration, costs, and requirements
- **🛠️ Skill Development Plans**: Step-by-step learning paths with specific timelines
- **💬 Interactive Chat Interface**: Engaging conversation-based career exploration
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🔄 Session Management**: Save and continue your career exploration sessions

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful UI components

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **OpenAI API** integration for AI-powered advice
- **SQLite** with Drizzle ORM for data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/career-advice-app.git
   cd career-advice-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 📖 Usage

### Getting Career Advice
1. Start a conversation by typing your career interests or questions
2. Ask about specific careers like "I want to become a software engineer"
3. Get detailed information about:
   - Career overview and opportunities
   - Recommended degrees and education paths
   - Essential skills needed
   - Step-by-step learning roadmap

### Example Queries
- "What should I study to become a data scientist?"
- "I'm interested in teaching, what are my options?"
- "How do I transition into software engineering?"
- "What skills do I need for a career in marketing?"

## 🎨 Key Features

### Enhanced Education Recommendations
- **Detailed Degree Information**: Specific degree names, duration, and estimated costs
- **Multiple Pathways**: Traditional university, community college, bootcamps, and certifications
- **Contextual Skills**: Skills explained with real-world applications
- **Actionable Learning Plans**: Time-bound steps with clear milestones

### Intelligent Fallback System
When the AI service is unavailable, the app provides comprehensive fallback advice covering:
- Software Engineering
- Data Science
- Teaching
- General career guidance

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── types/         # TypeScript type definitions
├── server/                # Backend Express application
│   ├── services/          # Business logic and external APIs
│   ├── routes.ts          # API route definitions
│   └── storage.ts         # Database operations
├── shared/                # Shared types and schemas
└── README.md
```

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- The React and Node.js communities
- All contributors who help improve this project

---

**Made with ❤️ for career seekers everywhere**
# MedTech Virtual Laboratory

A modern, interactive virtual laboratory platform for STEM education at SMU (Mediterranean Institution of Technology). Built with Next.js, TypeScript, and Tailwind CSS, this platform provides students with engaging physics simulations and educational content.

## 🔬 Features

- **Interactive Physics Simulations**: Powered by PhET Interactive Simulations
- **Office 365 SSO Authentication**: Secure login using SMU student/faculty accounts
- **Role-Based Access**: Different features for students, faculty, and guests
- **Comprehensive Lab Collection**: 3+ virtual laboratories covering mechanics, waves, electricity, thermodynamics, and optics
- **User Dashboard**: Personalized dashboard with progress tracking and quick access
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Search & Filter**: Advanced filtering by category, difficulty, and topics
- **Progress Tracking**: Monitor learning progress and lab completion
- **Educational Resources**: Detailed lab instructions and learning objectives
- **Evaluation System**: Built-in feedback and assessment tools
- **Secure Authentication**: Microsoft Azure AD integration for enterprise security

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd medtech-vl-web
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up authentication:

```bash
# Copy the environment variables template
cp .env.local.example .env.local

# Edit .env.local and add your Azure AD credentials
# See AZURE_AD_SETUP.md for detailed instructions
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── evaluation/        # Lab evaluation system
│   ├── labs/              # Virtual laboratories
│   │   └── [id]/         # Dynamic lab pages
│   ├── globals.css        # Global styles with Tailwind CSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Footer.tsx         # Site footer
│   └── Navigation.tsx     # Navigation bar
└── lib/                   # Utilities and data
    ├── data.ts            # Lab data and categories
    └── types.ts           # TypeScript type definitions
```

## 🧪 Virtual Laboratories

The platform includes the following virtual laboratories:

### Mechanics

- **Collision Lab**: Explore elastic and inelastic collisions
- **Projectile Motion**: Investigate projectile trajectories
- **Pendulum Lab**: Study oscillatory motion

### Waves & Sound

- **Wave on a String**: Explore wave properties
- **Sound**: Investigate sound wave characteristics

### Electricity & Magnetism

- **Circuit Construction Kit**: Build and analyze circuits
- **Charges and Fields**: Visualize electric fields

### Thermodynamics

- **Energy Forms and Changes**: Study energy transformations

### Optics

- **Geometric Optics**: Study light behavior through lenses
- **Bending Light**: Explore refraction and Snell's law

## 🎨 Design System

### Color Palette

- **Primary**: #057999 (Teal/Cyan)
- **Secondary**: Various complementary colors for categories
- **Neutral**: Gray scale for text and backgrounds

### Typography

- **Font Family**: Heebo (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components

- Built with Tailwind CSS utility classes
- Responsive design patterns
- Consistent spacing and typography scale

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Google Fonts (Heebo)
- **Simulations**: PhET Interactive Simulations (embedded)
- **Development**: ESLint, PostCSS

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Educational Objectives

This platform is designed to:

1. **Enhance Understanding**: Make abstract physics concepts tangible through visualization
2. **Promote Inquiry**: Encourage students to ask questions and explore
3. **Support Learning**: Provide structured learning paths and objectives
4. **Enable Accessibility**: Make quality physics education available anytime, anywhere
5. **Foster Engagement**: Create interactive and engaging learning experiences

## 🏫 About SMU

This platform is developed for SMU (Mediterranean Institution of Technology), part of South Mediterranean University in Tunisia, dedicated to providing innovative educational technology solutions for STEM education.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For technical support or questions about the platform:

- Email: support@medtech-vl.edu
- Visit: [Contact Page](http://localhost:3000/contact)

## 🙏 Acknowledgments

- [PhET Interactive Simulations](https://phet.colorado.edu/) for providing high-quality physics simulations
- [Next.js](https://nextjs.org/) for the excellent React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

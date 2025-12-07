# Mr Build - Product Overview

## 🏗️ Executive Summary

**Mr Build** is a comprehensive digital platform for South Africa's leading building materials retailer, combining a modern marketing website with a secure admin portal for content management. The platform showcases Mr Build's services, brands, and locations while enabling efficient customer engagement and business administration.

---

## 📊 Product Description

### What is Mr Build?

Mr Build is a Next.js-based web application that serves as the digital storefront and brand presence for Mr Build's retail locations across South Africa. The platform provides:

1. **Public-facing website** - Marketing, services showcase, brand partnerships, and customer engagement
2. **Admin portal** - Secure backend for managing content, brands, messages, and site configuration
3. **Contact system** - Customer inquiry management with email integration
4. **Location services** - Interactive branch locator with mapping

---

## 🎯 Target Audience

### Primary Users

**1. Customers**

- Contractors and builders seeking quality materials
- DIY enthusiasts and homeowners
- Construction professionals
- Community members looking for building solutions

**2. Business Administrators**

- Marketing team managing content and promotions
- Branch managers updating location information
- Customer service handling inquiries
- IT team maintaining site configuration

---

## ✨ Key Features

### Public Website Features

#### 1. **Hero Section**

- Dynamic welcome with brand messaging
- Icon bar highlighting key services:
  - 1000+ Products
  - 3 Locations
  - 24+ Brands
  - Quality Materials

#### 2. **About Section**

- Company story and mission
- Parallax background effects for visual engagement
- Brand values and commitment to quality

#### 3. **Services Showcase**

- Interactive slider with service categories
- Visual presentation of:
  - Timber & Building Materials
  - Hardware & Tools
  - Plumbing & Electrical
  - Paint & Decor
  - Roofing Solutions
  - And more...

#### 4. **Performance Numbers**

- Animated statistics:
  - Products in stock
  - Happy customers served
  - Branch locations
  - Partner brands
  - Years in business

#### 5. **Special Promotions**

- Rotating specials slider
- Featured deals and seasonal offers
- Product highlights and savings

#### 6. **Brand Partnerships**

- Animated brand marquee
- 24+ partner brand logos
- Quality manufacturer relationships

#### 7. **Branch Locator**

- Interactive map with Leaflet.js
- Three locations:
  - **Tzaneen**: Corner Danie Joubert & Claude Wheatley St
  - **Giyani**: Corner Main & Hospital St
  - **Phalaborwa**: Industrial Area, Selati St
- Click-to-navigate functionality
- Contact details and operating hours

#### 8. **Contact Form**

- Customer inquiry submission
- Email integration via Nodemailer
- Form validation and user feedback
- Direct routing to business email

#### 9. **Footer**

- Business information
- Social media links (Instagram, Facebook)
- Quick navigation
- Copyright and branding

### Admin Portal Features

#### 1. **Secure Authentication**

- NextAuth.js powered login system
- Email/password credentials
- JWT session management
- 30-day session persistence
- Auto-redirect for unauthenticated access

#### 2. **Admin Dashboard**

- Modern, responsive interface
- User profile management
- Quick stats overview
- Management cards for:

  **Content Management**

  - Homepage content editing
  - Service descriptions
  - About section updates

  **Brand Management**

  - Add/edit/remove brand logos
  - Partner information
  - Brand display ordering

  **Contact Messages**

  - View customer inquiries
  - Read/unread status
  - Response management

  **Branch Locations**

  - Update store information
  - Manage coordinates and addresses
  - Operating hours configuration

  **SEO Settings**

  - Meta tags management
  - Search optimization
  - Schema markup configuration

  **Site Settings**

  - General configuration
  - Email settings
  - Feature toggles

#### 3. **Route Protection**

- Middleware-based access control
- Protected `/admin` routes
- Session validation
- Automatic login redirects

#### 4. **Admin User Management**

- Secure account creation via `/setup` route
- Bcrypt password hashing (12 rounds)
- MongoDB user storage
- Setup secret protection

---

## 🏛️ Technical Architecture

### Technology Stack

**Frontend Framework**

- **Next.js 14** - React framework with App Router
- **React 18** - UI component library
- **TypeScript** - Type-safe development

**Styling & UI**

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library (admin)
- **Framer Motion** - Animation library
- **Custom CSS** - Brand-specific styling

**Authentication & Security**

- **NextAuth.js v4** - Authentication framework
- **bcryptjs** - Password hashing
- **JWT** - Session tokens
- **Middleware** - Route protection

**Database**

- **MongoDB Atlas** - Cloud database
- **@auth/mongodb-adapter** - Database integration
- Collections:
  - `admins` - Admin user credentials
  - Future: `content`, `brands`, `messages`, `branches`

**Maps & Location**

- **Leaflet.js** - Interactive mapping
- **React Leaflet** - React wrapper for Leaflet

**Email & Communication**

- **Nodemailer** - Email sending
- **Zoho SMTP** - Email service provider

**Additional Libraries**

- **Swiper** - Touch slider functionality
- **react-scroll-parallax** - Parallax effects
- **next-sitemap** - SEO sitemap generation

### Application Structure

```
mrbuild-web/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public website routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── promotion/     # Promo pages
│   │   │   └── components/    # Public components
│   │   │       ├── HeroSection/
│   │   │       ├── AboutSection/
│   │   │       ├── ServicesSection/
│   │   │       ├── NumbersSection/
│   │   │       ├── SpecialsSection/
│   │   │       ├── BrandsSection/
│   │   │       ├── BranchLocator/
│   │   │       ├── ContactSection/
│   │   │       ├── Header/
│   │   │       └── Footer/
│   │   │
│   │   ├── (admin)/           # Protected admin routes
│   │   │   └── admin/
│   │   │       └── page.tsx   # Dashboard
│   │   │
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/         # Login page
│   │   │   └── setup/         # Initial admin setup
│   │   │
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── contact/       # Contact form handler
│   │   │   └── admin/         # Admin operations
│   │   │
│   │   └── layout.tsx         # Root layout with SEO
│   │
│   ├── components/            # Shared components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── providers/         # Context providers
│   │   ├── SectionHeading/
│   │   └── NumberAnimation/
│   │
│   ├── lib/                   # Utilities
│   │   ├── auth.ts            # NextAuth config
│   │   ├── mongodb.ts         # Database connection
│   │   └── utils.ts           # Helper functions
│   │
│   ├── types/                 # TypeScript types
│   │   └── next-auth.d.ts     # Auth type extensions
│   │
│   ├── styles/
│   │   └── globals.css        # Global styles
│   │
│   └── middleware.ts          # Route protection
│
├── public/                    # Static assets
│   ├── images/                # Brand images, photos
│   ├── fonts/                 # Aleo, DINOT fonts
│   ├── robots.txt             # SEO crawler rules
│   └── sitemap.xml            # Site structure
│
├── docs/                      # Documentation
│   ├── brand.md               # Brand guidelines
│   └── product.md             # This file
│
└── Configuration files
    ├── next.config.mjs        # Next.js config
    ├── tailwind.config.ts     # Tailwind config
    ├── tsconfig.json          # TypeScript config
    ├── next-sitemap.config.js # Sitemap generation
    └── .env.local             # Environment variables
```

---

## 🎨 Design System

### Visual Identity

**Brand Colors**

- Primary Yellow: #F5DF11 - CTAs, highlights, accents
- MrBuild Red: #ED1C24 - Secondary accents, emphasis
- Dark Background: #1A1A1A - Main backgrounds
- White: #FFFFFF - Text on dark, clean sections
- Gray tones for secondary elements

**Typography**

- **Headings**: Aleo (serif) - Traditional, trustworthy
- **Body**: DINOT (sans-serif) - Modern, readable
- Font weights: Regular (400), Bold (700)

**Design Principles**

- **Responsive**: Mobile-first, adaptive layouts
- **Accessible**: WCAG compliant components
- **Fast**: Optimized images, code splitting
- **Modern**: Clean, contemporary aesthetics
- **Professional**: Business-focused design

### User Experience

**Navigation**

- Sticky header for easy access
- Smooth scroll to sections
- Clear CTAs throughout
- Mobile hamburger menu

**Interactions**

- Animated number counters
- Parallax scrolling effects
- Hover states on cards
- Smooth transitions
- Interactive map

**Forms**

- Client-side validation
- Real-time feedback
- Loading states
- Success/error messages

---

## 🔐 Security Features

### Authentication Security

- Password hashing with bcrypt (12 rounds)
- JWT tokens with secret signing
- HTTP-only cookies (via NextAuth)
- CSRF protection built-in
- Session expiration (30 days)

### API Security

- Protected endpoints with middleware
- Setup route requires secret token
- Input validation on all forms
- Environment variable protection

### Data Security

- MongoDB Atlas cloud security
- Secure credential storage
- No plain text passwords
- Encrypted connections

---

## 🌍 SEO & Performance

### Search Engine Optimization

- Semantic HTML structure
- OpenGraph meta tags
- Twitter Card integration
- Structured data (Schema.org):
  - Organization markup
  - LocalBusiness for each branch
  - Contact information
- Dynamic sitemap generation
- Robots.txt configuration

### Performance Optimization

- Next.js App Router for fast navigation
- Image optimization
- Code splitting
- Font optimization
- CSS-in-JS for minimal bundles
- Static generation where possible

### Metadata

- Page-specific titles and descriptions
- Keywords for search relevance
- Social media preview images
- Locale specification (en_ZA)

---

## 📱 Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Adaptive Features

- Flexible grid layouts
- Touch-optimized interactions
- Mobile-friendly navigation
- Responsive images
- Adaptive typography

---

## 🚀 Deployment & Hosting

### Environment Configuration

**Development**

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
MAIL_HOST=smtppro.zoho.com
```

**Production**

```env
NODE_ENV=production
NEXTAUTH_URL=https://mrbuild.co.za
MONGODB_URI=mongodb+srv://...
MAIL_HOST=smtppro.zoho.com
```

### Build Process

```bash
npm run build        # Production build
npm run start        # Start production server
npm run dev          # Development server
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Email service verified
- [ ] SSL/HTTPS enabled
- [ ] Domain configured
- [ ] Analytics integrated
- [ ] Error monitoring setup
- [ ] Backup strategy in place

---

## 📊 Analytics & Monitoring

### Potential Integrations

- **Google Analytics** - Traffic and user behavior
- **Search Console** - SEO performance
- **Hotjar/Microsoft Clarity** - User interaction heatmaps
- **Sentry** - Error tracking
- **Uptime monitoring** - Service availability

---

## 🔄 Data Flow

### Customer Journey

```
User visits homepage
    ↓
Browses services/brands/specials
    ↓
Finds branch location on map
    ↓
Submits contact form
    ↓
Email sent to business
    ↓
Admin views message in portal
    ↓
Follow-up with customer
```

### Admin Workflow

```
Admin visits /admin
    ↓
Redirected to /login (if not authenticated)
    ↓
Enters credentials
    ↓
NextAuth validates against MongoDB
    ↓
JWT session created
    ↓
Redirected to dashboard
    ↓
Manages content/brands/messages
    ↓
Changes reflected on public site
```

---

## 🎯 Business Value

### For Customers

- **Easy access** to product and service information
- **Visual engagement** with brand partnerships
- **Convenient** branch location finding
- **Direct communication** via contact form
- **Mobile-friendly** experience

### For Business

- **Professional** online presence
- **Content control** via admin portal
- **Customer insights** from contact forms
- **Brand showcase** for partnerships
- **SEO optimization** for discoverability
- **Scalable** platform for growth

---

## 🚧 Future Enhancements

### Planned Features

1. **E-commerce Integration**

   - Online product catalog
   - Shopping cart functionality
   - Online ordering system
   - Payment gateway integration

2. **Content Management**

   - Full CMS for all sections
   - Image upload capability
   - Rich text editing
   - Version control

3. **Customer Portal**

   - User accounts
   - Order history
   - Saved projects
   - Loyalty program

4. **Enhanced Analytics**

   - Customer behavior tracking
   - Conversion funnels
   - A/B testing
   - Performance dashboards

5. **Mobile App**

   - React Native application
   - Push notifications
   - In-app promotions
   - Mobile-first features

6. **AI Integration**
   - Chatbot support
   - Product recommendations
   - Smart search
   - Inventory predictions

---

## 📈 Success Metrics

### Key Performance Indicators (KPIs)

**Website Performance**

- Page load time < 3 seconds
- Mobile responsiveness score > 95
- SEO score > 90
- Uptime > 99.9%

**User Engagement**

- Average session duration
- Pages per session
- Bounce rate
- Contact form conversion rate

**Business Impact**

- Contact form submissions
- Branch locator interactions
- Special promotions clicks
- Social media referrals

---

## 🛠️ Maintenance & Support

### Regular Maintenance

- **Security updates** - Monthly dependency updates
- **Content updates** - Ongoing via admin portal
- **Performance monitoring** - Weekly reviews
- **Backup verification** - Daily automated backups

### Support Channels

- Technical documentation (this file)
- Admin guides (ADMIN_SETUP.md)
- Developer README.md
- Issue tracking (GitHub)

---

## 📞 Contact & Resources

### Project Links

- **Website**: https://mrbuild.co.za
- **Instagram**: @mrbuild_sa
- **Facebook**: /mrbuildsa

### Technical Documentation

- [README.md](../README.md) - Developer guide
- [ADMIN_SETUP.md](../ADMIN_SETUP.md) - Admin portal setup
- [QUICKSTART.md](../QUICKSTART.md) - Quick start guide
- [Brand Guidelines](brand.md) - Visual identity

---

## 📝 Version History

**Version 2.0** (Current)

- ✅ Admin portal with authentication
- ✅ MongoDB integration
- ✅ Enhanced security features
- ✅ shadcn/ui component library
- ✅ Route protection middleware

**Version 1.0**

- ✅ Public website launch
- ✅ Contact form integration
- ✅ Branch locator
- ✅ Brand partnerships showcase
- ✅ SEO optimization

---

## 🎓 Technical Requirements

### Development Environment

- Node.js 18+ (20+ recommended)
- npm 9+ or equivalent package manager
- MongoDB Atlas account
- Email service provider (Zoho)
- Git for version control

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🏆 Competitive Advantages

1. **Modern Technology Stack** - Latest Next.js with App Router
2. **Secure Admin System** - Professional content management
3. **Mobile-First Design** - Optimized for all devices
4. **SEO Optimized** - Better search visibility
5. **Fast Performance** - Quick load times, smooth interactions
6. **Scalable Architecture** - Ready for future growth
7. **Professional Design** - Trust and credibility

---

## 📋 Summary

The Mr Build platform is a comprehensive digital solution that successfully bridges the gap between traditional building materials retail and modern web technology. It provides customers with easy access to information and services while empowering the business with tools to manage their online presence effectively.

The platform's dual nature—public website and admin portal—ensures both customer satisfaction and business efficiency. With its solid technical foundation, modern design, and room for growth, Mr Build's digital platform is positioned to support the business's continued success in the South African building materials market.

---

**Document Version**: 1.0  
**Last Updated**: October 18, 2025  
**Maintained By**: Development Team  
**Status**: Production Ready

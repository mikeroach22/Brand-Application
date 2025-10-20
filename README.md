# Brand Application Portal
## Apply for Physical Retail Placement with bright.blue

This is a standalone Next.js application for brands to apply for physical retail placement through the bright.blue vending machine network.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database/auth)
- Google Maps API key

### Installation

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd Brand-Application
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- Other optional variables (see `.env.example`)

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Features

- **6-Step Application Process:**
  1. Company Information (Email, Company Name, Shopify URL, Phone)
  2. Product Selection (Choose products from Shopify catalog)
  3. Machine Selection (Interactive map to choose vending machine locations)
  4. Campaign Duration (3, 6, or 12 months)
  5. Product Configuration (Assign products to machines and rows)
  6. Review & Submit (Summary and payment)

- **Real-time Progress Tracking**
- **Interactive Map** for machine selection
- **Product Margin Calculator**
- **Campaign Cost Estimator**
- **Shopify Integration** (demo mode included)

---

## 📋 Application Flow

### Step 1: Company Info
Brands provide:
- Email address
- Company name
- Shopify store URL
- Phone number
- Company registration number (optional)

### Step 2: Product Selection
- Auto-loads products from Shopify store (demo mode available)
- Shows retail price, wholesale cost, and margins
- Select multiple products
- Categories organized for easy browsing

### Step 3: Machine Selection
- Interactive map of available vending machine locations
- Filter by:
  - Location type (Gym, Office, Airport, etc.)
  - Foot traffic
  - Demographics
  - Average sales
- See machine details (location, tier, pricing)

### Step 4: Campaign Duration
- Choose 3, 6, or 12 months
- See total cost breakdown
- Monthly payment options available

### Step 5: Product Configuration
- Assign products to specific machines
- Configure rows/trays per machine
- Set quantities

### Step 6: Review & Submit
- Complete campaign summary
- Cost breakdown
- Payment processing
- Submit application

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components + Lucide Icons
- **Database:** Supabase (PostgreSQL)
- **Maps:** Google Maps API
- **Authentication:** Supabase Auth (optional)

---

## 🌍 Environment Variables

### Required Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Optional Variables:

```env
# Default city for machine selection
NEXT_PUBLIC_DEFAULT_CITY=london

# Ably Realtime (if needed for live updates)
NEXT_PUBLIC_ABLY_KEY=your_ably_client_key

# Server-side only
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

---

## 📂 Project Structure

```
Brand-Application/
├── src/
│   ├── app/
│   │   └── page.tsx                 # Main application page
│   ├── components/
│   │   ├── CompanyInfoStep.tsx      # Step 1: Company info form
│   │   ├── ProductSelectionStep.tsx # Step 2: Product selection
│   │   ├── MachineSelectionStep.tsx # Step 3: Machine picker (map)
│   │   ├── CampaignDurationStep.tsx # Step 4: Duration selector
│   │   ├── ProductConfigStep.tsx    # Step 5: Product configuration
│   │   └── CampaignSummaryStep.tsx  # Step 6: Review & submit
│   ├── lib/
│   │   └── env.ts                    # Environment config
│   └── types/
│       └── index.ts                  # TypeScript types
├── .env.example                      # Example environment variables
├── .env.local                        # Your actual environment variables (git-ignored)
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind CSS config
├── next.config.ts                    # Next.js config
└── README.md                         # This file
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted (Node.js server)

---

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.ts`
- Replace logo and images in `public/` folder
- Modify text content in component files

### Products
- Replace demo products in `ProductSelectionStep.tsx`
- Or integrate with real Shopify API

### Machines
- Update machine data in `MachineSelectionStep.tsx`
- Or fetch from your Supabase database

---

## 🔒 Security Notes

- Never commit `.env.local` to git
- Use environment variables for all sensitive keys
- Validate all user inputs on the server-side
- Use Supabase Row Level Security (RLS) for database access

---

## 📞 Support

For questions or issues:
- Email: support@brightblue.co
- Documentation: [docs link]
- GitHub Issues: [issues link]

---

## 📄 License

[Your License Here]

---

**Built with ❤️ by bright.blue**


# 🚐 Caravan

Welcome to Caravan - Your journey starts here! A beautiful, responsive website for adventurers and travelers.

## 🌐 Live Website

Visit the live site at: **https://harry-ship-it78.github.io/caravan/**

## 📋 Overview

Caravan is a static website built with modern web technologies, featuring:
- Clean, responsive design that works on all devices
- Smooth animations and interactive elements
- Accessible navigation and user experience
- Automated deployment via GitHub Pages

## 🚀 Local Development

### Prerequisites
- A modern web browser
- Basic knowledge of HTML, CSS, and JavaScript (for modifications)

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harry-ship-it78/caravan.git
   cd caravan
   ```

2. **Open in browser:**
   Simply open `index.html` in your web browser, or use a local server:
   
   **Option A: Python (if available):**
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```
   
   **Option B: Node.js (if available):**
   ```bash
   npx serve .
   # Then visit the provided URL
   ```

3. **Make changes:**
   - Edit `index.html` for content structure
   - Modify `style.css` for styling
   - Update `script.js` for interactive behavior

## 🏗️ Build and Deployment

### Static Site Structure
```
caravan/
├── index.html          # Main homepage
├── style.css           # Stylesheet
├── script.js           # JavaScript functionality
├── 404.html            # Custom 404 page
├── README.md           # Documentation
└── .github/
    └── workflows/
        └── pages.yml    # GitHub Actions deployment
```

### Automated Deployment

The site uses **GitHub Actions** for automated deployment to GitHub Pages:

- **Trigger:** Pushes to the `main` branch
- **Workflow:** `.github/workflows/pages.yml`
- **Output:** Static files served from the repository root
- **URL:** https://harry-ship-it78.github.io/caravan/

### Manual Deployment

No manual steps required! Simply push changes to the `main` branch and GitHub Actions will automatically:
1. Build and prepare the site
2. Deploy to GitHub Pages
3. Update the live website

## 🛠️ Customization

### Adding New Sections
1. Add HTML content to `index.html`
2. Update navigation links in the header
3. Add corresponding styles in `style.css`
4. Update JavaScript in `script.js` if needed

### Styling Changes
- All styles are in `style.css`
- Uses CSS Grid and Flexbox for layout
- Responsive design with mobile-first approach
- CSS custom properties for easy theming

### Interactive Features
- Smooth scrolling navigation
- Scroll-based animations
- Responsive header behavior
- Mobile-friendly design

## 🎨 Features

- **Responsive Design:** Works beautifully on desktop, tablet, and mobile
- **Modern Styling:** Clean, professional appearance with smooth animations
- **Fast Loading:** Optimized static files for quick page loads
- **SEO Friendly:** Proper meta tags and semantic HTML structure
- **Accessible:** Built with accessibility best practices
- **Custom 404:** Branded error page for better user experience

## 🔧 Technical Details

- **Technology:** Pure HTML5, CSS3, and vanilla JavaScript
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Domain:** github.io subdomain
- **SSL:** Automatically provided by GitHub Pages

## 📁 File Structure Details

- `index.html` - Main webpage with all content sections
- `style.css` - Complete styling including responsive design
- `script.js` - Interactive functionality and smooth scrolling
- `404.html` - Custom error page matching site design
- `.github/workflows/pages.yml` - Automated deployment configuration
- `.gitignore` - Excludes common development artifacts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [GitHub Issues](https://github.com/harry-ship-it78/caravan/issues)
2. Create a new issue if needed
3. Provide detailed information about the problem

---

**Happy traveling with Caravan! 🚐✨**
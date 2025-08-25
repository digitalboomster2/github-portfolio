# 🎨 Easy Portfolio Editing Guide

## ✨ **No HTML/CSS Knowledge Required!**

Your portfolio is now **super easy to edit**! Just change the `config.js` file and everything updates automatically.

## 📝 **What You Can Edit in `config.js`:**

### 1. **Personal Information** (Lines 5-12)
```javascript
personal: {
    name: "Obum Aldin Ijere",        // Your full name
    shortName: "OBUM",               // Short name for logo
    title: "Motion Designer, Developer", // Your title
    location: "LAGOS, NIGERIA",      // Your location
    email: "obum@example.com",       // Your email
    tagline: "CRAFT THE UNEXPECTED + OBUM@EXAMPLE.COM" // Your tagline
}
```

### 2. **Social Media Links** (Lines 14-20)
```javascript
social: {
    github: "https://github.com/digitalboomster2",     // Your GitHub
    linkedin: "https://linkedin.com/in/yourusername",  // Your LinkedIn
    instagram: "https://instagram.com/yourusername",   // Your Instagram
    twitter: "https://twitter.com/yourusername",       // Your Twitter
    behance: "https://behance.net/yourusername"        // Your Behance
}
```

### 3. **About Section** (Lines 22-30)
```javascript
about: {
    description: "Your description here...", // Change this text
    stats: [
        { number: "5+", label: "Years Experience" },      // Change numbers
        { number: "100+", label: "Projects Completed" },  // Change numbers
        { number: "50+", label: "Happy Clients" }         // Change numbers
    ]
}
```

### 4. **Projects/Work** (Lines 32-85)
```javascript
work: [
    {
        title: "Batch",                    // Project name
        category: "Motion Design",         // Project category
        image: "images/batch.jpg",         // Your project image
        icon: "fas fa-project-diagram",    // Icon if no image
        description: "Project description", // Project description
        link: "https://example.com/batch"  // Project link
    }
    // Add more projects by copying this structure
]
```

### 5. **Skills** (Lines 87-92)
```javascript
skills: {
    "Motion Design": ["After Effects", "Cinema 4D", "Blender"], // Change skills
    "Web Development": ["HTML/CSS", "JavaScript", "React"],     // Change skills
    // Add more skill categories
}
```

## 🖼️ **Adding Images:**

1. **Put your images** in the `images/` folder
2. **Update the image path** in `config.js`:
   ```javascript
   image: "images/your-project-image.jpg"
   ```
3. **If no image**, it will show the icon instead

## 🚀 **Quick Steps to Customize:**

1. **Open `config.js`** in any text editor
2. **Change the text** you want to update
3. **Save the file**
4. **Refresh your browser** - changes appear instantly!

## 💡 **Pro Tips:**

- **Keep project names short** like rojthegoat.com (Batch, Collective, etc.)
- **Use high-quality images** (recommended: 800x600px)
- **Update social links** with your real profiles
- **Change colors** in the theme section if you want

## 🔧 **Advanced Customization:**

If you want to change colors, edit the theme section:
```javascript
theme: {
    primary: "#1a1a1a",      // Main text color
    secondary: "#666666",     // Secondary text color
    background: "#f8f8f8",    // Background color
    accent: "#f0f0f0"        // Accent color
}
```

## 📱 **Test Your Changes:**

1. **Save `config.js`**
2. **Open `index.html`** in your browser
3. **See your changes instantly!**

That's it! No HTML, no CSS, just edit the config file and your portfolio updates automatically! 🎉

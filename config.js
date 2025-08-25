// PORTFOLIO CONFIGURATION FILE
// Edit this file to customize your portfolio - no HTML knowledge needed!

const PORTFOLIO_CONFIG = {
    // Personal Information
    personal: {
        name: "Obum Aldin Ijere",
        shortName: "OBUMNEME OKECHUKWU IJERE",
        title: "Motion Designer, Developer",
        location: "LAGOS, NIGERIA",
        email: "obum@example.com",
        tagline: "CRAFT THE UNEXPECTED + OBUM@EXAMPLE.COM"
    },

    // Social Media Links
    social: {
        github: "https://github.com/digitalboomster2",
        linkedin: "https://linkedin.com/in/yourusername",
        instagram: "https://instagram.com/yourusername",
        twitter: "https://twitter.com/yourusername",
        behance: "https://behance.net/yourusername"
    },

    // About/Info Section
    about: {
        description: "I'm a creative professional specializing in motion design, web development, and digital experiences. Based in Lagos, Nigeria, I craft unexpected solutions that blend technology and creativity.",
        stats: [
            { number: "5+", label: "Years Experience" },
            { number: "100+", label: "Projects Completed" },
            { number: "50+", label: "Happy Clients" }
        ]
    },

    // Work/Projects Section - Minimalist style like rojthegoat.com
    work: [
        {
            title: "Batch",
            category: "Motion Design",
            image: "images/batch.jpg", // Add your image here
            icon: "fas fa-project-diagram", // FontAwesome icon if no image
            description: "Creative motion design project for brand identity",
            link: "https://example.com/batch"
        },
        {
            title: "Collective",
            category: "Art Direction",
            image: "images/collective.jpg",
            icon: "fas fa-users",
            description: "Art direction and creative direction for major brands",
            link: "https://example.com/collective"
        },
        {
            title: "Cloudera",
            category: "Web Development",
            image: "images/cloudera.jpg",
            icon: "fas fa-cloud",
            description: "Modern web application with cutting-edge technology",
            link: "https://example.com/cloudera"
        },
        {
            title: "Cabinetry Lab",
            category: "3D Animation",
            image: "images/cabinetry-lab.jpg",
            icon: "fas fa-cube",
            description: "3D animation and motion graphics for film and advertising",
            link: "https://example.com/cabinetry-lab"
        },
        {
            title: "Infinite Water",
            category: "Motion Graphics",
            image: "images/infinite-water.jpg",
            icon: "fas fa-water",
            description: "Creative motion graphics and visual effects",
            link: "https://example.com/infinite-water"
        },
        {
            title: "Yellow Lab",
            category: "Brand Design",
            image: "images/yellow-lab.jpg",
            icon: "fas fa-paint-brush",
            description: "Complete brand identity and visual design systems",
            link: "https://example.com/yellow-lab"
        },
        {
            title: "Alpha",
            category: "Video Direction",
            image: "images/alpha.jpg",
            icon: "fas fa-video",
            description: "Film production and video direction for creative projects",
            link: "https://example.com/alpha"
        },
        {
            title: "Jelly Feels",
            category: "Creative Direction",
            image: "images/jelly-feels.jpg",
            icon: "fas fa-heart",
            description: "Creative direction and emotional storytelling",
            link: "https://example.com/jelly-feels"
        }
    ],

    // Skills/Technologies
    skills: {
        "Motion Design": ["After Effects", "Cinema 4D", "Blender", "Adobe Creative Suite"],
        "Web Development": ["HTML/CSS", "JavaScript", "React", "Node.js", "Python"],
        "Design Tools": ["Figma", "Sketch", "Photoshop", "Illustrator"],
        "3D & Animation": ["Cinema 4D", "Blender", "Houdini", "Maya"]
    },

    // Contact Information
    contact: {
        heading: "Let's create something amazing together",
        message: "I'm always open to new opportunities and exciting projects. Whether you have a question or want to collaborate, let's connect!",
        formEnabled: true // Set to false to disable contact form
    },

    // Theme Colors (Optional - for advanced customization)
    theme: {
        primary: "#1a1a1a",
        secondary: "#666666",
        background: "#f8f8f8",
        accent: "#f0f0f0"
    },

    // Page Settings
    settings: {
        showTime: false, // Show current time in hero section
        showStats: true, // Show statistics in about section
        showSkills: true, // Show skills section
        enableAnimations: true, // Enable smooth animations
        enableParallax: true // Enable parallax effects
    }
};

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PORTFOLIO_CONFIG;
}

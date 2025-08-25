// Portfolio Visual Editor
let currentConfig = {};
let editingProjectIndex = -1;
let editingSkillCategory = '';

// Initialize editor when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentConfig();
    setupEventListeners();
    loadProjectsList();
    loadSkillsList();
});

// Load current configuration
function loadCurrentConfig() {
    if (typeof PORTFOLIO_CONFIG !== 'undefined') {
        currentConfig = JSON.parse(JSON.stringify(PORTFOLIO_CONFIG));
        populateEditorFields();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Personal info fields
    document.getElementById('edit-name').addEventListener('input', updateConfig);
    document.getElementById('edit-shortName').addEventListener('input', updateConfig);
    document.getElementById('edit-title').addEventListener('input', updateConfig);
    document.getElementById('edit-location').addEventListener('input', updateConfig);
    document.getElementById('edit-email').addEventListener('input', updateConfig);
    document.getElementById('edit-tagline').addEventListener('input', updateConfig);

    // Social links
    document.getElementById('edit-github').addEventListener('input', updateConfig);
    document.getElementById('edit-linkedin').addEventListener('input', updateConfig);
    document.getElementById('edit-instagram').addEventListener('input', updateConfig);
    document.getElementById('edit-twitter').addEventListener('input', updateConfig);
    document.getElementById('edit-behance').addEventListener('input', updateConfig);

    // Image upload
    setupImageUpload();
}

// Populate editor fields with current config
function populateEditorFields() {
    // Personal info
    document.getElementById('edit-name').value = currentConfig.personal.name || '';
    document.getElementById('edit-shortName').value = currentConfig.personal.shortName || '';
    document.getElementById('edit-title').value = currentConfig.personal.title || '';
    document.getElementById('edit-location').value = currentConfig.personal.location || '';
    document.getElementById('edit-email').value = currentConfig.personal.email || '';
    document.getElementById('edit-tagline').value = currentConfig.personal.tagline || '';

    // Social links
    document.getElementById('edit-github').value = currentConfig.social.github || '';
    document.getElementById('edit-linkedin').value = currentConfig.social.linkedin || '';
    document.getElementById('edit-instagram').value = currentConfig.social.instagram || '';
    document.getElementById('edit-twitter').value = currentConfig.social.twitter || '';
    document.getElementById('edit-behance').value = currentConfig.social.behance || '';
}

// Update config when fields change
function updateConfig() {
    // Personal info
    currentConfig.personal.name = document.getElementById('edit-name').value;
    currentConfig.personal.shortName = document.getElementById('edit-shortName').value;
    currentConfig.personal.title = document.getElementById('edit-title').value;
    currentConfig.personal.location = document.getElementById('edit-location').value;
    currentConfig.personal.email = document.getElementById('edit-email').value;
    currentConfig.personal.tagline = document.getElementById('edit-tagline').value;

    // Social links
    currentConfig.social.github = document.getElementById('edit-github').value;
    currentConfig.social.linkedin = document.getElementById('edit-linkedin').value;
    currentConfig.social.instagram = document.getElementById('edit-instagram').value;
    currentConfig.social.twitter = document.getElementById('edit-twitter').value;
    currentConfig.social.behance = document.getElementById('edit-behance').value;

    // Auto-save to localStorage
    localStorage.setItem('portfolioConfig', JSON.stringify(currentConfig));
    
    // Update preview
    updatePreview();
}

// Load projects list
function loadProjectsList() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    currentConfig.work.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.category}</p>
            <div class="project-actions">
                <button class="edit-btn" onclick="editProject(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteProject(${index})">Delete</button>
            </div>
        `;
        projectsList.appendChild(projectItem);
    });
}

// Load skills list
function loadSkillsList() {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';

    Object.entries(currentConfig.skills).forEach(([category, skills]) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-category-item';
        
        const skillTags = skills.map(skill => `
            <span class="skill-tag">
                ${skill}
                <button class="remove-skill" onclick="removeSkill('${category}', '${skill}')">&times;</button>
            </span>
        `).join('');

        skillItem.innerHTML = `
            <h4>${category}</h4>
            <div class="skill-tags">
                ${skillTags}
            </div>
            <div class="add-skill-input">
                <input type="text" placeholder="Add skill" id="skill-input-${category}">
                <button onclick="addSkill('${category}')">Add</button>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeSkillCategory('${category}')" style="margin-top: 10px;">
                Remove Category
            </button>
        `;
        skillsList.appendChild(skillItem);
    });
}

// Add new project
function addNewProject() {
    const newProject = {
        title: "New Project",
        category: "Category",
        image: "",
        icon: "fas fa-project-diagram",
        description: "Project description",
        link: ""
    };

    currentConfig.work.push(newProject);
    loadProjectsList();
    updatePreview();
}

// Edit project
function editProject(index) {
    editingProjectIndex = index;
    const project = currentConfig.work[index];

    document.getElementById('modal-project-title').value = project.title;
    document.getElementById('modal-project-category').value = project.category;
    document.getElementById('modal-project-description').value = project.description;
    document.getElementById('modal-project-image').value = project.image;
    document.getElementById('modal-project-link').value = project.link;
    document.getElementById('modal-project-icon').value = project.icon;

    document.getElementById('project-modal').style.display = 'block';
}

// Save project
function saveProject() {
    if (editingProjectIndex >= 0) {
        currentConfig.work[editingProjectIndex] = {
            title: document.getElementById('modal-project-title').value,
            category: document.getElementById('modal-project-category').value,
            description: document.getElementById('modal-project-description').value,
            image: document.getElementById('modal-project-image').value,
            link: document.getElementById('modal-project-link').value,
            icon: document.getElementById('modal-project-icon').value
        };

        loadProjectsList();
        updatePreview();
        closeProjectModal();
    }
}

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        currentConfig.work.splice(index, 1);
        loadProjectsList();
        updatePreview();
    }
}

// Close project modal
function closeProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
    editingProjectIndex = -1;
}

// Add new skill category
function addNewSkillCategory() {
    const categoryName = prompt('Enter skill category name:');
    if (categoryName && categoryName.trim()) {
        currentConfig.skills[categoryName] = [];
        loadSkillsList();
        updatePreview();
    }
}

// Add skill to category
function addSkill(category) {
    const input = document.getElementById(`skill-input-${category}`);
    const skill = input.value.trim();
    
    if (skill) {
        currentConfig.skills[category].push(skill);
        input.value = '';
        loadSkillsList();
        updatePreview();
    }
}

// Remove skill from category
function removeSkill(category, skill) {
    const index = currentConfig.skills[category].indexOf(skill);
    if (index > -1) {
        currentConfig.skills[category].splice(index, 1);
        loadSkillsList();
        updatePreview();
    }
}

// Remove skill category
function removeSkillCategory(category) {
    if (confirm(`Are you sure you want to remove the "${category}" category?`)) {
        delete currentConfig.skills[category];
        loadSkillsList();
        updatePreview();
    }
}

// Setup image upload
function setupImageUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('image-upload');

    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#1a1a1a';
        uploadArea.style.background = '#f0f0f0';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e0e0e0';
        uploadArea.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e0e0e0';
        uploadArea.style.background = 'transparent';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });
}

// Handle image upload
function handleImageUpload(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // For demo purposes, we'll use the data URL
            // In production, you'd upload to a server and get a URL
            document.getElementById('image-url-input').value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file.');
    }
}

// Save image
function saveImage() {
    const imageUrl = document.getElementById('image-url-input').value;
    if (imageUrl) {
        // Update the current project's image if editing
        if (editingProjectIndex >= 0) {
            currentConfig.work[editingProjectIndex].image = imageUrl;
            loadProjectsList();
            updatePreview();
        }
        closeImageModal();
    }
}

// Close image modal
function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
}

// Update preview
function updatePreview() {
    const preview = document.getElementById('portfolio-preview');
    if (preview.contentWindow) {
        // Update the config in the preview iframe
        preview.contentWindow.postMessage({
            type: 'UPDATE_CONFIG',
            config: currentConfig
        }, '*');
    }
}

// Save changes
function saveChanges() {
    // Save to config.js (this would require server-side processing in production)
    localStorage.setItem('portfolioConfig', JSON.stringify(currentConfig));
    
    // Create downloadable config file
    const configContent = `const PORTFOLIO_CONFIG = ${JSON.stringify(currentConfig, null, 4)};`;
    const blob = new Blob([configContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.js';
    a.click();
    
    URL.revokeObjectURL(url);
    
    alert('Configuration saved! Download the config.js file and replace your existing one.');
}

// Preview portfolio
function previewPortfolio() {
    const preview = document.getElementById('portfolio-preview');
    preview.src = 'index.html';
}

// Reset to default
function resetToDefault() {
    if (confirm('Are you sure you want to reset to default configuration? This will undo all changes.')) {
        if (typeof PORTFOLIO_CONFIG !== 'undefined') {
            currentConfig = JSON.parse(JSON.stringify(PORTFOLIO_CONFIG));
            populateEditorFields();
            loadProjectsList();
            loadSkillsList();
            updatePreview();
            localStorage.removeItem('portfolioConfig');
        }
    }
}

// Toggle edit mode
function toggleEditMode() {
    const preview = document.getElementById('portfolio-preview');
    if (preview.contentWindow) {
        preview.contentWindow.postMessage({
            type: 'TOGGLE_EDIT_MODE'
        }, '*');
    }
}

// Refresh preview
function refreshPreview() {
    const preview = document.getElementById('portfolio-preview');
    preview.src = preview.src;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                saveChanges();
                break;
            case 'p':
                e.preventDefault();
                previewPortfolio();
                break;
            case 'r':
                e.preventDefault();
                refreshPreview();
                break;
        }
    }
});

// Auto-save every 30 seconds
setInterval(() => {
    if (Object.keys(currentConfig).length > 0) {
        localStorage.setItem('portfolioConfig', JSON.stringify(currentConfig));
    }
}, 30000);

// Load saved config from localStorage on startup
window.addEventListener('load', () => {
    const savedConfig = localStorage.getItem('portfolioConfig');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            currentConfig = { ...currentConfig, ...parsed };
            populateEditorFields();
            loadProjectsList();
            loadSkillsList();
        } catch (e) {
            console.error('Error loading saved config:', e);
        }
    }
});

// Portfolio Visual Editor - Working Version
let currentConfig = {};
let editingProjectIndex = -1;

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
    
    // Also load from localStorage if available
    const savedConfig = localStorage.getItem('portfolioConfig');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            currentConfig = { ...currentConfig, ...parsed };
            populateEditorFields();
        } catch (e) {
            console.error('Error loading saved config:', e);
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Personal info fields
    const nameField = document.getElementById('edit-name');
    if (nameField) nameField.addEventListener('input', updateConfig);
    
    const shortNameField = document.getElementById('edit-shortName');
    if (shortNameField) shortNameField.addEventListener('input', updateConfig);
    
    const titleField = document.getElementById('edit-title');
    if (titleField) titleField.addEventListener('input', updateConfig);
    
    const locationField = document.getElementById('edit-location');
    if (locationField) locationField.addEventListener('input', updateConfig);
    
    const emailField = document.getElementById('edit-email');
    if (emailField) emailField.addEventListener('input', updateConfig);
    
    const taglineField = document.getElementById('edit-tagline');
    if (taglineField) taglineField.addEventListener('input', updateConfig);

    // Social links
    const githubField = document.getElementById('edit-github');
    if (githubField) githubField.addEventListener('input', updateConfig);
    
    const linkedinField = document.getElementById('edit-linkedin');
    if (linkedinField) linkedinField.addEventListener('input', updateConfig);
    
    const instagramField = document.getElementById('edit-instagram');
    if (instagramField) instagramField.addEventListener('input', updateConfig);
    
    const twitterField = document.getElementById('edit-twitter');
    if (twitterField) twitterField.addEventListener('input', updateConfig);
    
    const behanceField = document.getElementById('edit-behance');
    if (behanceField) behanceField.addEventListener('input', updateConfig);
}

// Populate editor fields with current config
function populateEditorFields() {
    // Personal info
    const nameField = document.getElementById('edit-name');
    if (nameField) nameField.value = currentConfig.personal?.name || '';
    
    const shortNameField = document.getElementById('edit-shortName');
    if (shortNameField) shortNameField.value = currentConfig.personal?.shortName || '';
    
    const titleField = document.getElementById('edit-title');
    if (titleField) titleField.value = currentConfig.personal?.title || '';
    
    const locationField = document.getElementById('edit-location');
    if (locationField) locationField.value = currentConfig.personal?.location || '';
    
    const emailField = document.getElementById('edit-email');
    if (emailField) emailField.value = currentConfig.personal?.email || '';
    
    const taglineField = document.getElementById('edit-tagline');
    if (taglineField) taglineField.value = currentConfig.personal?.tagline || '';

    // Social links
    const githubField = document.getElementById('edit-github');
    if (githubField) githubField.value = currentConfig.social?.github || '';
    
    const linkedinField = document.getElementById('edit-linkedin');
    if (linkedinField) linkedinField.value = currentConfig.social?.linkedin || '';
    
    const instagramField = document.getElementById('edit-instagram');
    if (instagramField) instagramField.value = currentConfig.social?.instagram || '';
    
    const twitterField = document.getElementById('edit-twitter');
    if (twitterField) twitterField.value = currentConfig.social?.twitter || '';
    
    const behanceField = document.getElementById('edit-behance');
    if (behanceField) behanceField.value = currentConfig.social?.behance || '';
}

// Update config when fields change
function updateConfig() {
    // Personal info
    if (!currentConfig.personal) currentConfig.personal = {};
    currentConfig.personal.name = document.getElementById('edit-name')?.value || '';
    currentConfig.personal.shortName = document.getElementById('edit-shortName')?.value || '';
    currentConfig.personal.title = document.getElementById('edit-title')?.value || '';
    currentConfig.personal.location = document.getElementById('edit-location')?.value || '';
    currentConfig.personal.email = document.getElementById('edit-email')?.value || '';
    currentConfig.personal.tagline = document.getElementById('edit-tagline')?.value || '';

    // Social links
    if (!currentConfig.social) currentConfig.social = {};
    currentConfig.social.github = document.getElementById('edit-github')?.value || '';
    currentConfig.social.linkedin = document.getElementById('edit-linkedin')?.value || '';
    currentConfig.social.instagram = document.getElementById('edit-instagram')?.value || '';
    currentConfig.social.twitter = document.getElementById('edit-twitter')?.value || '';
    currentConfig.social.behance = document.getElementById('edit-behance')?.value || '';

    // Store in localStorage for persistence
    localStorage.setItem('portfolioConfig', JSON.stringify(currentConfig));
    
    // Show success message
    showNotification('Changes saved automatically!', 'success');
    
    // Update preview
    updatePreview();
}

// Load projects list
function loadProjectsList() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList || !currentConfig.work) return;
    
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
    if (!skillsList || !currentConfig.skills) return;
    
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
    if (!currentConfig.work) currentConfig.work = [];
    
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
    updateConfig();
}

// Edit project
function editProject(index) {
    editingProjectIndex = index;
    const project = currentConfig.work[index];

    const titleField = document.getElementById('modal-project-title');
    if (titleField) titleField.value = project.title;
    
    const categoryField = document.getElementById('modal-project-category');
    if (categoryField) categoryField.value = project.category;
    
    const descriptionField = document.getElementById('modal-project-description');
    if (descriptionField) descriptionField.value = project.description;
    
    const imageField = document.getElementById('modal-project-image');
    if (imageField) imageField.value = project.image;
    
    const linkField = document.getElementById('modal-project-link');
    if (linkField) linkField.value = project.link;
    
    const iconField = document.getElementById('modal-project-icon');
    if (iconField) iconField.value = project.icon;

    const modal = document.getElementById('project-modal');
    if (modal) modal.style.display = 'block';
}

// Save project
function saveProject() {
    if (editingProjectIndex >= 0) {
        currentConfig.work[editingProjectIndex] = {
            title: document.getElementById('modal-project-title')?.value || '',
            category: document.getElementById('modal-project-category')?.value || '',
            description: document.getElementById('modal-project-description')?.value || '',
            image: document.getElementById('modal-project-image')?.value || '',
            link: document.getElementById('modal-project-link')?.value || '',
            icon: document.getElementById('modal-project-icon')?.value || ''
        };

        loadProjectsList();
        updateConfig();
        closeProjectModal();
    }
}

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        currentConfig.work.splice(index, 1);
        loadProjectsList();
        updateConfig();
    }
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) modal.style.display = 'none';
    editingProjectIndex = -1;
}

// Add new skill category
function addNewSkillCategory() {
    if (!currentConfig.skills) currentConfig.skills = {};
    
    const categoryName = prompt('Enter skill category name:');
    if (categoryName && categoryName.trim()) {
        currentConfig.skills[categoryName] = [];
        loadSkillsList();
        updateConfig();
    }
}

// Add skill to category
function addSkill(category) {
    const input = document.getElementById(`skill-input-${category}`);
    if (!input) return;
    
    const skill = input.value.trim();
    
    if (skill) {
        currentConfig.skills[category].push(skill);
        input.value = '';
        loadSkillsList();
        updateConfig();
    }
}

// Remove skill from category
function removeSkill(category, skill) {
    const index = currentConfig.skills[category].indexOf(skill);
    if (index > -1) {
        currentConfig.skills[category].splice(index, 1);
        loadSkillsList();
        updateConfig();
    }
}

// Remove skill category
function removeSkillCategory(category) {
    if (confirm(`Are you sure you want to remove the "${category}" category?`)) {
        delete currentConfig.skills[category];
        loadSkillsList();
        updateConfig();
    }
}

// Update preview
function updatePreview() {
    const preview = document.getElementById('portfolio-preview');
    if (preview && preview.contentWindow) {
        // Update the config in the preview iframe
        preview.contentWindow.postMessage({
            type: 'UPDATE_CONFIG',
            config: currentConfig
        }, '*');
    }
}

// Save changes
function saveChanges() {
    updateConfig();
    showNotification('Changes saved successfully!', 'success');
}

// Preview portfolio
function previewPortfolio() {
    const preview = document.getElementById('portfolio-preview');
    if (preview) preview.src = 'index.html';
}

// Reset to default
function resetToDefault() {
    if (confirm('Are you sure you want to reset to default configuration? This will undo all changes.')) {
        if (typeof PORTFOLIO_CONFIG !== 'undefined') {
            currentConfig = JSON.parse(JSON.stringify(PORTFOLIO_CONFIG));
            populateEditorFields();
            loadProjectsList();
            loadSkillsList();
            localStorage.removeItem('portfolioConfig');
        }
    }
}

// Toggle edit mode
function toggleEditMode() {
    const preview = document.getElementById('portfolio-preview');
    if (preview && preview.contentWindow) {
        preview.contentWindow.postMessage({
            type: 'TOGGLE_EDIT_MODE'
        }, '*');
    }
}

// Refresh preview
function refreshPreview() {
    const preview = document.getElementById('portfolio-preview');
    if (preview) preview.src = preview.src;
}

// Toggle grid overlay
function toggleGridOverlay() {
    gridOverlayVisible = !gridOverlayVisible;
    const preview = document.getElementById('portfolio-preview');
    
    if (preview && preview.contentWindow) {
        if (gridOverlayVisible) {
            preview.contentWindow.postMessage({
                type: 'SHOW_GRID_OVERLAY'
            }, '*');
        } else {
            preview.contentWindow.postMessage({
                type: 'HIDE_GRID_OVERLAY'
            }, '*');
        }
    }
}

// Export layout
function exportLayout() {
    const layoutData = {
        config: currentConfig,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-layout.json';
    a.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('Layout exported successfully!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Setup image upload
function setupImageUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('image-upload');
    
    if (!uploadArea || !fileInput) return;

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
            const imageUrlInput = document.getElementById('image-url-input');
            if (imageUrlInput) imageUrlInput.value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file.');
    }
}

// Save image
function saveImage() {
    const imageUrlInput = document.getElementById('image-url-input');
    if (!imageUrlInput) return;
    
    const imageUrl = imageUrlInput.value;
    if (imageUrl) {
        if (editingProjectIndex >= 0) {
            currentConfig.work[editingProjectIndex].image = imageUrl;
            loadProjectsList();
            updateConfig();
        }
        closeImageModal();
    }
}

// Close image modal
function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) modal.style.display = 'none';
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
            case 'g':
                e.preventDefault();
                toggleGridOverlay();
                break;
        }
    }
});

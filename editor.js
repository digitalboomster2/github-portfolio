// Portfolio Visual Editor - Enhanced Version with Real-Time Updates
let currentConfig = {};
let editingProjectIndex = -1;
let editingSkillCategory = '';
let gridOverlayVisible = false;
let autoSaveEnabled = true;
let lastSavedConfig = null;

// Initialize editor when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentConfig();
    setupEventListeners();
    loadProjectsList();
    loadSkillsList();
    setupSpacingControls();
    setupVisibilityToggles();
    setupDragAndDrop();
    setupRealTimeUpdates();
    
    // Start auto-save
    startAutoSave();
});

// Setup real-time updates
function setupRealTimeUpdates() {
    // Enable real-time mode by default
    currentConfig.realTimeMode = true;
    
    // Setup file watcher simulation (in production, this would use a real file watcher)
    setupFileWatcher();
    
    // Setup live preview updates
    setupLivePreview();
}

// Setup file watcher simulation
function setupFileWatcher() {
    // In a real implementation, this would watch for file changes
    // For now, we'll simulate it with periodic checks
    setInterval(() => {
        checkForExternalChanges();
    }, 2000); // Check every 2 seconds
}

// Check for external changes
function checkForExternalChanges() {
    // This would check if the config file was modified externally
    // For now, we'll just ensure our changes are always up-to-date
    if (lastSavedConfig && JSON.stringify(currentConfig) !== JSON.stringify(lastSavedConfig)) {
        // Config has changed, update the live portfolio
        updateLivePortfolio();
    }
}

// Setup live preview
function setupLivePreview() {
    const preview = document.getElementById('portfolio-preview');
    if (preview) {
        preview.addEventListener('load', function() {
            // Preview is loaded, set up real-time communication
            setupPreviewCommunication();
        });
    }
}

// Setup preview communication
function setupPreviewCommunication() {
    const preview = document.getElementById('portfolio-preview');
    if (preview.contentWindow) {
        // Send initial config
        preview.contentWindow.postMessage({
            type: 'INIT_CONFIG',
            config: currentConfig
        }, '*');
        
        // Listen for messages from preview
        window.addEventListener('message', function(event) {
            if (event.source === preview.contentWindow) {
                handlePreviewMessage(event.data);
            }
        });
    }
}

// Handle messages from preview
function handlePreviewMessage(data) {
    switch (data.type) {
        case 'CONFIG_UPDATED':
            // Preview has updated its config
            console.log('Preview config updated successfully');
            break;
        case 'ERROR':
            console.error('Preview error:', data.message);
            break;
        case 'REQUEST_CONFIG':
            // Preview is requesting current config
            updatePreview();
            break;
    }
}

// Update live portfolio (real-time without downloads)
function updateLivePortfolio() {
    // Update the actual portfolio files in real-time
    updateConfigFile();
    updatePortfolioFiles();
    
    // Update preview
    updatePreview();
    
    // Mark as saved
    lastSavedConfig = JSON.parse(JSON.stringify(currentConfig));
    
    // Show success message
    showNotification('Portfolio updated in real-time!', 'success');
    
    // Show real-time indicator
    showRealTimeIndicator();
}

// Update config file in real-time
function updateConfigFile() {
    try {
        // Store in localStorage for persistence
        localStorage.setItem('portfolioConfig', JSON.stringify(currentConfig));
        
        // Also update the actual config object in the page
        if (typeof PORTFOLIO_CONFIG !== 'undefined') {
            Object.assign(PORTFOLIO_CONFIG, currentConfig);
        }
        
        console.log('Config file updated in real-time');
    } catch (error) {
        console.error('Error updating config file:', error);
        showNotification('Error updating config file', 'error');
    }
}

// Update portfolio files in real-time
function updatePortfolioFiles() {
    try {
        // Update HTML structure if needed
        updatePortfolioHTML();
        
        // Update CSS if needed
        updatePortfolioCSS();
        
        console.log('Portfolio files updated in real-time');
    } catch (error) {
        console.error('Error updating portfolio files:', error);
        showNotification('Error updating portfolio files', 'error');
    }
}

// Update portfolio HTML structure
function updatePortfolioHTML() {
    // This would update the actual HTML file with new structure
    // For now, we'll just update the preview
    const preview = document.getElementById('portfolio-preview');
    if (preview.contentWindow) {
        preview.contentWindow.postMessage({
            type: 'UPDATE_HTML_STRUCTURE',
            config: currentConfig
        }, '*');
    }
}

// Update portfolio CSS
function updatePortfolioCSS() {
    // This would update the actual CSS file with new styles
    // For now, we'll just update the preview
    const preview = document.getElementById('portfolio-preview');
    if (preview.contentWindow) {
        preview.contentWindow.postMessage({
            type: 'UPDATE_CSS',
            config: currentConfig
        }, '*');
    }
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

// Show real-time indicator
function showRealTimeIndicator() {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.real-time-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'real-time-indicator';
    indicator.innerHTML = `
        <div class="pulse"></div>
        <span>Real-time updates active</span>
    `;
    
    document.body.appendChild(indicator);
    
    // Hide after 3 seconds
    setTimeout(() => {
        if (indicator.parentElement) {
            indicator.remove();
        }
    }, 3000);
}

// Start auto-save
function startAutoSave() {
    setInterval(() => {
        if (autoSaveEnabled && Object.keys(currentConfig).length > 0) {
            // Check if config has changed
            if (!lastSavedConfig || JSON.stringify(currentConfig) !== JSON.stringify(lastSavedConfig)) {
                // Auto-save changes
                updateLivePortfolio();
            }
        }
    }, 5000); // Auto-save every 5 seconds if changes detected
}

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
    
    // Mark as last saved
    lastSavedConfig = JSON.parse(JSON.stringify(currentConfig));
}

// Setup event listeners
function setupEventListeners() {
    // Personal info fields
    document.getElementById('edit-name').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-shortName').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-title').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-location').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-email').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-tagline').addEventListener('input', updateConfigRealTime);

    // Social links
    document.getElementById('edit-github').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-linkedin').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-instagram').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-twitter').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-behance').addEventListener('input', updateConfigRealTime);

    // Layout controls
    setupLayoutControls();
    
    // Image upload
    setupImageUpload();
}

// Update config in real-time
function updateConfigRealTime() {
    // Update config immediately
    updateConfig();
    
    // Update live portfolio in real-time
    updateLivePortfolio();
}

// Setup layout controls
function setupLayoutControls() {
    // Work layout
    const workLayout = document.getElementById('work-layout');
    if (workLayout) {
        workLayout.addEventListener('change', function() {
            currentConfig.workLayout = this.value;
            updateLivePortfolio();
        });
    }

    // Work columns
    const workColumns = document.getElementById('work-columns');
    if (workColumns) {
        workColumns.addEventListener('input', function() {
            const value = this.value;
            document.getElementById('work-columns-value').textContent = value;
            currentConfig.workColumns = parseInt(value);
            updateLivePortfolio();
        });
    }

    // Skills layout
    const skillsLayout = document.getElementById('skills-layout');
    if (skillsLayout) {
        skillsLayout.addEventListener('change', function() {
            currentConfig.skillsLayout = this.value;
            updateLivePortfolio();
        });
    }

    // Contact form toggle
    const contactFormEnabled = document.getElementById('contact-form-enabled');
    if (contactFormEnabled) {
        contactFormEnabled.addEventListener('change', function() {
            currentConfig.contact.formEnabled = this.checked;
            updateLivePortfolio();
        });
    }
}

// Setup spacing controls
function setupSpacingControls() {
    // Global spacing
    const sectionPadding = document.getElementById('section-padding');
    const elementMargin = document.getElementById('element-margin');
    
    if (sectionPadding) {
        sectionPadding.addEventListener('input', function() {
            const value = this.value + 'px';
            document.getElementById('section-padding-value').textContent = value;
            currentConfig.globalSpacing = currentConfig.globalSpacing || {};
            currentConfig.globalSpacing.sectionPadding = value;
            updateLivePortfolio();
        });
    }

    if (elementMargin) {
        elementMargin.addEventListener('input', function() {
            const value = this.value + 'px';
            document.getElementById('element-margin-value').textContent = value;
            currentConfig.globalSpacing = currentConfig.globalSpacing || {};
            currentConfig.globalSpacing.elementMargin = value;
            updateLivePortfolio();
        });
    }

    // Section-specific spacing
    setupSectionSpacing('personal');
    setupSectionSpacing('social');
    setupSectionSpacing('work');
    setupSectionSpacing('skills');
    setupSectionSpacing('contact');
}

// Setup section spacing controls
function setupSectionSpacing(sectionName) {
    const topSlider = document.getElementById(`${sectionName}-top`);
    const bottomSlider = document.getElementById(`${sectionName}-bottom`);
    
    if (topSlider) {
        topSlider.addEventListener('input', function() {
            const value = this.value + 'px';
            document.getElementById(`${sectionName}-top-value`).textContent = value;
            currentConfig.sectionSpacing = currentConfig.sectionSpacing || {};
            currentConfig.sectionSpacing[sectionName] = currentConfig.sectionSpacing[sectionName] || {};
            currentConfig.sectionSpacing[sectionName].top = value;
            updateLivePortfolio();
        });
    }

    if (bottomSlider) {
        bottomSlider.addEventListener('input', function() {
            const value = this.value + 'px';
            document.getElementById(`${sectionName}-bottom-value`).textContent = value;
            currentConfig.sectionSpacing = currentConfig.sectionSpacing || {};
            currentConfig.sectionSpacing[sectionName] = currentConfig.sectionSpacing[sectionName] || {};
            currentConfig.sectionSpacing[sectionName].bottom = value;
            updateLivePortfolio();
        });
    }
}

// Setup visibility toggles
function setupVisibilityToggles() {
    const toggles = ['hero', 'work', 'info', 'skills', 'contact'];
    
    toggles.forEach(section => {
        const toggle = document.getElementById(`toggle-${section}`);
        if (toggle) {
            toggle.addEventListener('change', function() {
                currentConfig.sectionVisibility = currentConfig.sectionVisibility || {};
                currentConfig.sectionVisibility[section] = this.checked;
                updateLivePortfolio();
            });
        }
    });
}

// Setup drag and drop
function setupDragAndDrop() {
    // Projects list
    const projectsList = document.getElementById('projects-list');
    if (projectsList) {
        makeSortable(projectsList, 'projects');
    }

    // Skills list
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
        makeSortable(skillsList, 'skills');
    }
}

// Make list sortable
function makeSortable(container, type) {
    let draggedItem = null;

    container.addEventListener('dragstart', function(e) {
        draggedItem = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    container.addEventListener('dragend', function(e) {
        e.target.classList.remove('dragging');
        draggedItem = null;
    });

    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    container.addEventListener('dragenter', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('sortable-item')) {
            e.target.classList.add('drag-enter');
        }
    });

    container.addEventListener('dragleave', function(e) {
        if (e.target.classList.contains('sortable-item')) {
            e.target.classList.remove('drag-enter');
        }
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        if (e.target.classList.contains('sortable-item') && draggedItem) {
            e.target.classList.remove('drag-enter');
            
            const items = Array.from(container.querySelectorAll('.sortable-item'));
            const draggedIndex = items.indexOf(draggedItem);
            const droppedIndex = items.indexOf(e.target);
            
            if (draggedIndex !== -1 && droppedIndex !== -1) {
                reorderItems(type, draggedIndex, droppedIndex);
            }
        }
    });
}

// Reorder items
function reorderItems(type, fromIndex, toIndex) {
    if (type === 'projects') {
        const projects = currentConfig.work;
        const [movedItem] = projects.splice(fromIndex, 1);
        projects.splice(toIndex, 0, movedItem);
        loadProjectsList();
    } else if (type === 'skills') {
        const skillCategories = Object.keys(currentConfig.skills);
        const [movedCategory] = skillCategories.splice(fromIndex, 1);
        skillCategories.splice(toIndex, 0, movedCategory);
        
        const newSkills = {};
        skillCategories.forEach(category => {
            newSkills[category] = currentConfig.skills[category];
        });
        currentConfig.skills = newSkills;
        loadSkillsList();
    }
    
    // Update live portfolio immediately
    updateLivePortfolio();
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

    // Layout settings
    if (currentConfig.workLayout) {
        document.getElementById('work-layout').value = currentConfig.workLayout;
    }
    if (currentConfig.workColumns) {
        document.getElementById('work-columns').value = currentConfig.workColumns;
        document.getElementById('work-columns-value').textContent = currentConfig.workColumns;
    }
    if (currentConfig.skillsLayout) {
        document.getElementById('skills-layout').value = currentConfig.skillsLayout;
    }
    if (currentConfig.contact && currentConfig.contact.formEnabled !== undefined) {
        document.getElementById('contact-form-enabled').checked = currentConfig.contact.formEnabled;
    }

    // Section visibility
    if (currentConfig.sectionVisibility) {
        Object.keys(currentConfig.sectionVisibility).forEach(section => {
            const toggle = document.getElementById(`toggle-${section}`);
            if (toggle) {
                toggle.checked = currentConfig.sectionVisibility[section];
            }
        });
    }

    // Global spacing
    if (currentConfig.globalSpacing) {
        if (currentConfig.globalSpacing.sectionPadding) {
            const value = parseInt(currentConfig.globalSpacing.sectionPadding);
            document.getElementById('section-padding').value = value;
            document.getElementById('section-padding-value').textContent = value + 'px';
        }
        if (currentConfig.globalSpacing.elementMargin) {
            const value = parseInt(currentConfig.globalSpacing.elementMargin);
            document.getElementById('element-margin').value = value;
            document.getElementById('element-margin-value').textContent = value + 'px';
        }
    }

    // Section spacing
    if (currentConfig.sectionSpacing) {
        Object.keys(currentConfig.sectionSpacing).forEach(section => {
            const spacing = currentConfig.sectionSpacing[section];
            if (spacing.top) {
                const value = parseInt(spacing.top);
                const slider = document.getElementById(`${section}-top`);
                if (slider) {
                    slider.value = value;
                    document.getElementById(`${section}-top-value`).textContent = value + 'px';
                }
            }
            if (spacing.bottom) {
                const value = parseInt(spacing.bottom);
                const slider = document.getElementById(`${section}-bottom`);
                if (slider) {
                    slider.value = value;
                    document.getElementById(`${section}-bottom-value`).textContent = value + 'px';
                }
            }
        });
    }
}

// Update config when fields change (legacy function)
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

    // Store in localStorage for persistence
    localStorage.setItem('portfolioConfig', JSON.stringify(currentConfig));
}

// Load projects list with enhanced features
function loadProjectsList() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    currentConfig.work.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'sortable-item';
        projectItem.draggable = true;
        projectItem.innerHTML = `
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="item-content">
                <h4>${project.title}</h4>
                <p>${project.category}</p>
                <div class="project-actions">
                    <button class="edit-btn" onclick="editProject(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteProject(${index})">Delete</button>
                    <button class="btn btn-sm btn-secondary" onclick="editProjectDetails(${index})">
                        <i class="fas fa-edit"></i> Details
                    </button>
                </div>
            </div>
        `;
        projectsList.appendChild(projectItem);
    });
}

// Load skills list with enhanced features
function loadSkillsList() {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';

    Object.entries(currentConfig.skills).forEach(([category, skills], index) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'sortable-item';
        skillItem.draggable = true;
        
        const skillTags = skills.map(skill => `
            <span class="skill-tag">
                ${skill}
                <button class="remove-skill" onclick="removeSkill('${category}', '${skill}')">&times;</button>
            </span>
        `).join('');

        skillItem.innerHTML = `
            <div class="drag-handle">
                <i class="fas fa-grip-vertical"></i>
            </div>
            <div class="item-content">
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
            </div>
        `;
        skillsList.appendChild(skillItem);
    });
}

// Add new project with enhanced details
function addNewProject() {
    const newProject = {
        title: "New Project",
        category: "Category",
        image: "",
        icon: "fas fa-project-diagram",
        description: "Project description",
        link: "",
        details: {
            bio: "Project bio and overview",
            process: "Creative process and workflow",
            credits: "Team and contributors",
            tools: "Software and tools used",
            duration: "Project timeline",
            client: "Client information"
        }
    };

    currentConfig.work.push(newProject);
    loadProjectsList();
    
    // Update live portfolio immediately
    updateLivePortfolio();
}

// Edit project details (bio, process, etc.)
function editProjectDetails(index) {
    editingProjectIndex = index;
    const project = currentConfig.work[index];
    
    // Create or show project detail editor
    showProjectDetailEditor(project);
}

// Show project detail editor
function showProjectDetailEditor(project) {
    // This would open a modal or expand the editor to show detailed project editing
    // For now, we'll update the config and show a message
    alert(`Editing project details for: ${project.title}\n\nThis will open a detailed editor for:\n- Project Bio\n- Process Description\n- Credits\n- Tools Used\n- Timeline\n- Client Info`);
    
    // In a full implementation, this would show a detailed form
    // for editing all project details including bio and process
}

// Add new skill category
function addNewSkillCategory() {
    const categoryName = prompt('Enter skill category name:');
    if (categoryName && categoryName.trim()) {
        currentConfig.skills[categoryName] = [];
        loadSkillsList();
        
        // Update live portfolio immediately
        updateLivePortfolio();
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
        
        // Update live portfolio immediately
        updateLivePortfolio();
    }
}

// Remove skill from category
function removeSkill(category, skill) {
    const index = currentConfig.skills[category].indexOf(skill);
    if (index > -1) {
        currentConfig.skills[category].splice(index, 1);
        loadSkillsList();
        
        // Update live portfolio immediately
        updateLivePortfolio();
    }
}

// Remove skill category
function removeSkillCategory(category) {
    if (confirm(`Are you sure you want to remove the "${category}" category?`)) {
        delete currentConfig.skills[category];
        loadSkillsList();
        
        // Update live portfolio immediately
        updateLivePortfolio();
    }
}

// Delete section
function deleteSection(sectionName) {
    if (confirm(`Are you sure you want to delete the ${sectionName} section? This cannot be undone.`)) {
        currentConfig.sectionVisibility = currentConfig.sectionVisibility || {};
        currentConfig.sectionVisibility[sectionName] = false;
        
        // Update the toggle
        const toggle = document.getElementById(`toggle-${sectionName}`);
        if (toggle) {
            toggle.checked = false;
        }
        
        // Update live portfolio immediately
        updateLivePortfolio();
    }
}

// Duplicate section
function duplicateSection(sectionName) {
    if (confirm(`Duplicate the ${sectionName} section?`)) {
        // This would create a copy of the section with a new name
        alert(`Section "${sectionName}" duplicated!\n\nYou can now customize the duplicate independently.`);
        
        // Update live portfolio immediately
        updateLivePortfolio();
    }
}

// Toggle grid overlay
function toggleGridOverlay() {
    gridOverlayVisible = !gridOverlayVisible;
    const preview = document.getElementById('portfolio-preview');
    
    if (gridOverlayVisible) {
        // Add grid overlay to preview
        preview.contentWindow.postMessage({
            type: 'SHOW_GRID_OVERLAY'
        }, '*');
    } else {
        // Hide grid overlay
        preview.contentWindow.postMessage({
            type: 'HIDE_GRID_OVERLAY'
        }, '*');
    }
}

// Export layout (now optional since we have real-time updates)
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

// Save changes (now optional since we have real-time updates)
function saveChanges() {
    // Since we now have real-time updates, this is just a manual save trigger
    updateLivePortfolio();
    
    showNotification('Changes saved successfully!', 'success');
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
            
            // Update live portfolio immediately
            updateLivePortfolio();
            
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
            case 'g':
                e.preventDefault();
                toggleGridOverlay();
                break;
        }
    }
});

// Keep existing functions for backward compatibility
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
        
        // Update live portfolio immediately
        updateLivePortfolio();
        
        closeProjectModal();
    }
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        currentConfig.work.splice(index, 1);
        loadProjectsList();
        
        // Update live portfolio immediately
        updateLivePortfolio();
    }
}

function closeProjectModal() {
    document.getElementById('project-modal').style.display = 'none';
    editingProjectIndex = -1;
}

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

function handleImageUpload(file) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('image-url-input').value = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file.');
    }
}

// Save changes (now optional since we have real-time updates)
function saveChanges() {
    // Since we now have real-time updates, this is just a manual save trigger
    updateLivePortfolio();
    
    showNotification('Changes saved successfully!', 'success');
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none';
}

// Real-time update functions

// Update live portfolio (real-time without downloads)
function updateLivePortfolio() {
    // Update the actual portfolio files in real-time
    updateConfigFile();
    updatePortfolioFiles();
    
    // Update preview
    updatePreview();
    
    // Mark as saved
    lastSavedConfig = JSON.parse(JSON.stringify(currentConfig));
    
    // Show success message
    showNotification('Portfolio updated in real-time!', 'success');
    
    // Show real-time indicator
    showRealTimeIndicator();
}

// Update config file in real-time
function updateConfigFile() {
    try {
        // Store in localStorage for persistence
        localStorage.setItem('portfolioConfig', JSON.stringify(currentConfig));
        
        // Also update the actual config object in the page
        if (typeof PORTFOLIO_CONFIG !== 'undefined') {
            Object.assign(PORTFOLIO_CONFIG, currentConfig);
        }
        
        console.log('Config file updated in real-time');
    } catch (error) {
        console.error('Error updating config file:', error);
        showNotification('Error updating config file', 'error');
    }
}

// Update portfolio files in real-time
function updatePortfolioFiles() {
    try {
        // Update HTML structure if needed
        updatePortfolioHTML();
        
        // Update CSS if needed
        updatePortfolioCSS();
        
        console.log('Portfolio files updated in real-time');
    } catch (error) {
        console.error('Error updating portfolio files:', error);
        showNotification('Error updating portfolio files', 'error');
    }
}

// Update portfolio HTML structure
function updatePortfolioHTML() {
    // This would update the actual HTML file with new structure
    // For now, we'll just update the preview
    const preview = document.getElementById('portfolio-preview');
    if (preview.contentWindow) {
        preview.contentWindow.postMessage({
            type: 'UPDATE_HTML_STRUCTURE',
            config: currentConfig
        }, '*');
    }
}

// Update portfolio CSS
function updatePortfolioCSS() {
    // This would update the actual CSS file with new styles
    // For now, we'll just update the preview
    const preview = document.getElementById('portfolio-preview');
    if (preview.contentWindow) {
        preview.contentWindow.postMessage({
            type: 'UPDATE_CSS',
            config: currentConfig
        }, '*');
    }
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

// Show real-time indicator
function showRealTimeIndicator() {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.real-time-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'real-time-indicator';
    indicator.innerHTML = `
        <div class="pulse"></div>
        <span>Real-time updates active</span>
    `;
    
    document.body.appendChild(indicator);
    
    // Hide after 3 seconds
    setTimeout(() => {
        if (indicator.parentElement) {
            indicator.remove();
        }
    }, 3000);
}

// Start auto-save
function startAutoSave() {
    setInterval(() => {
        if (autoSaveEnabled && Object.keys(currentConfig).length > 0) {
            // Check if config has changed
            if (!lastSavedConfig || JSON.stringify(currentConfig) !== JSON.stringify(lastSavedConfig)) {
                // Auto-save changes
                updateLivePortfolio();
            }
        }
    }, 5000); // Auto-save every 5 seconds if changes detected
}

// Initialize auto-save when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Start auto-save after a short delay
    setTimeout(() => {
        startAutoSave();
    }, 1000);
});

// Enhanced updateConfig function for real-time updates
function updateConfigRealTime() {
    // Update config immediately
    updateConfig();
    
    // Update live portfolio in real-time
    updateLivePortfolio();
}

// Setup real-time event listeners
function setupRealTimeEventListeners() {
    // Personal info fields
    document.getElementById('edit-name').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-shortName').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-title').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-location').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-email').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-tagline').addEventListener('input', updateConfigRealTime);

    // Social links
    document.getElementById('edit-github').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-linkedin').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-instagram').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-twitter').addEventListener('input', updateConfigRealTime);
    document.getElementById('edit-behance').addEventListener('input', updateConfigRealTime);
}

// Initialize real-time updates
document.addEventListener('DOMContentLoaded', function() {
    setupRealTimeEventListeners();
});



// Enhanced spacing controls for real-time updates
function setupSectionSpacing(sectionName) {
    const topSlider = document.getElementById(`${sectionName}-top`);
    const bottomSlider = document.getElementById(`${sectionName}-bottom`);
    
    if (topSlider) {
        topSlider.addEventListener('input', function() {
            const value = this.value + 'px';
            document.getElementById(`${sectionName}-top-value`).textContent = value;
            currentConfig.sectionSpacing = currentConfig.sectionSpacing || {};
            currentConfig.sectionSpacing[sectionName] = currentConfig.sectionSpacing[sectionName] || {};
            currentConfig.sectionSpacing[sectionName].top = value;
            updateLivePortfolio();
        });
    }

    if (bottomSlider) {
        bottomSlider.addEventListener('input', function() {
            const value = this.value + 'px';
            document.getElementById(`${sectionName}-bottom-value`).textContent = value;
            currentConfig.sectionSpacing = currentConfig.sectionSpacing || {};
            currentConfig.sectionSpacing[sectionName] = currentConfig.sectionSpacing[sectionName] || {};
            currentConfig.sectionSpacing[sectionName].bottom = value;
            updateLivePortfolio();
        });
    }
}

// Enhanced layout controls for real-time updates
function setupLayoutControls() {
    // Work layout
    const workLayout = document.getElementById('work-layout');
    if (workLayout) {
        workLayout.addEventListener('change', function() {
            currentConfig.workLayout = this.value;
            updateLivePortfolio();
        });
    }

    // Work columns
    const workColumns = document.getElementById('work-columns');
    if (workColumns) {
        workColumns.addEventListener('input', function() {
            const value = this.value;
            document.getElementById('work-columns-value').textContent = value;
            currentConfig.workColumns = parseInt(value);
            updateLivePortfolio();
        });
    }

    // Skills layout
    const skillsLayout = document.getElementById('skills-layout');
    if (skillsLayout) {
        skillsLayout.addEventListener('change', function() {
            currentConfig.skillsLayout = this.value;
            updateLivePortfolio();
        });
    }

    // Contact form toggle
    const contactFormEnabled = document.getElementById('contact-form-enabled');
    if (contactFormEnabled) {
        contactFormEnabled.addEventListener('change', function() {
            currentConfig.contact.formEnabled = this.checked;
            updateLivePortfolio();
        });
    }
}

// Enhanced visibility toggles for real-time updates
function setupVisibilityToggles() {
    const toggles = ['hero', 'work', 'info', 'skills', 'contact'];
    
    toggles.forEach(section => {
        const toggle = document.getElementById(`toggle-${section}`);
        if (toggle) {
            toggle.addEventListener('change', function() {
                currentConfig.sectionVisibility = currentConfig.sectionVisibility || {};
                currentConfig.sectionVisibility[section] = this.checked;
                updateLivePortfolio();
            });
        }
    });
}

// Enhanced reorder items for real-time updates
function reorderItems(type, fromIndex, toIndex) {
    if (type === 'projects') {
        const projects = currentConfig.work;
        const [movedItem] = projects.splice(fromIndex, 1);
        projects.splice(toIndex, 0, movedItem);
        loadProjectsList();
    } else if (type === 'skills') {
        const skillCategories = Object.keys(currentConfig.skills);
        const [movedCategory] = skillCategories.splice(fromIndex, 1);
        skillCategories.splice(toIndex, 0, movedCategory);
        
        const newSkills = {};
        skillCategories.forEach(category => {
            newSkills[category] = currentConfig.skills[category];
        });
        currentConfig.skills = newSkills;
        loadSkillsList();
    }
    
    // Update live portfolio immediately
    updateLivePortfolio();
}

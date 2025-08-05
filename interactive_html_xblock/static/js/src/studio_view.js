/* InteractiveJSBlock Studio View JavaScript */

function StudioView(runtime, element) {
    
    // Initialize the studio view
    function initializeStudio() {
        console.log('InteractiveJSBlock: Initializing studio view');
        
        // Setup tab navigation
        setupTabNavigation();
        
        // Setup form handling
        setupFormHandling();
        
        // Setup preview functionality
        setupPreview();
        
        // Setup test interaction functionality
        setupTestInteraction();
    }
    
    // Setup tab navigation
    function setupTabNavigation() {
        var tabButtons = element.querySelectorAll('.tab-button');
        var tabPanes = element.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var targetTab = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                tabPanes.forEach(function(pane) {
                    pane.classList.remove('active');
                });
                
                // Add active class to clicked button and corresponding pane
                this.classList.add('active');
                var targetPane = element.querySelector('#' + targetTab + '-tab');
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }
    
    // Setup form handling
    function setupFormHandling() {
        var saveButton = element.querySelector('#save-button');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                saveBlock();
            });
        }
    }
    
    // Save the block data
    function saveBlock() {
        console.log('InteractiveJSBlock: Saving block data');
        
        // Collect form data
        var formData = {
            display_name: getFieldValue('display_name'),
            html_content: getFieldValue('html_content'),
            css_content: getFieldValue('css_content'),
            js_content: getFieldValue('js_content'),
            weight: parseInt(getFieldValue('weight')) || 1,
            enable_debug_mode: getCheckboxValue('enable_debug_mode'),
            auto_grade_enabled: getCheckboxValue('auto_grade_enabled'),
            allowed_external_urls: parseJsonField('allowed_external_urls')
        };
        
        // Validate required fields
        if (!formData.html_content.trim()) {
            alert('HTML content cannot be empty');
            return;
        }
        
        // Show loading state
        var saveButton = element.querySelector('#save-button');
        var originalText = saveButton.textContent;
        saveButton.textContent = 'Saving...';
        saveButton.disabled = true;
        
        // Send data to XBlock
        var handlerUrl = runtime.handlerUrl(element, 'save_interaction');
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify(formData),
            contentType: "application/json",
            success: function(response) {
                console.log('InteractiveJSBlock: Save successful', response);
                saveButton.textContent = 'Saved!';
                setTimeout(function() {
                    saveButton.textContent = originalText;
                    saveButton.disabled = false;
                }, 2000);
            },
            error: function(xhr, status, error) {
                console.error('InteractiveJSBlock: Save failed', error);
                alert('Failed to save block: ' + error);
                saveButton.textContent = originalText;
                saveButton.disabled = false;
            }
        });
    }
    
    // Setup preview functionality
    function setupPreview() {
        var previewButton = element.querySelector('#preview-button');
        var modal = element.querySelector('#preview-modal');
        var closeButton = modal.querySelector('.close');
        var previewContent = modal.querySelector('#preview-content');
        
        if (previewButton) {
            previewButton.addEventListener('click', function() {
                showPreview();
            });
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                hidePreview();
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                hidePreview();
            }
        });
    }
    
    // Show preview
    function showPreview() {
        var modal = element.querySelector('#preview-modal');
        var previewContent = modal.querySelector('#preview-content');
        
        // Get current form values
        var htmlContent = getFieldValue('html_content');
        var cssContent = getFieldValue('css_content');
        var jsContent = getFieldValue('js_content');
        
        // Create preview HTML
        var previewHtml = `
            <div class="preview-container">
                <style>${cssContent}</style>
                <div class="preview-html">${htmlContent}</div>
                <script>
                    // Mock submitInteraction function for preview
                    window.submitInteraction = function(data) {
                        console.log('Preview: submitInteraction called with:', data);
                        alert('Preview: Interaction data would be sent: ' + JSON.stringify(data));
                    };
                    ${jsContent}
                </script>
            </div>
        `;
        
        previewContent.innerHTML = previewHtml;
        modal.style.display = 'block';
    }
    
    // Hide preview
    function hidePreview() {
        var modal = element.querySelector('#preview-modal');
        modal.style.display = 'none';
    }
    
    // Setup test interaction functionality
    function setupTestInteraction() {
        var testButton = element.querySelector('#test-interaction-button');
        if (testButton) {
            testButton.addEventListener('click', function() {
                testInteraction();
            });
        }
    }
    
    // Test interaction
    function testInteraction() {
        console.log('InteractiveJSBlock: Testing interaction');
        
        // Create test data
        var testData = {
            test: true,
            timestamp: new Date().toISOString(),
            message: 'Test interaction from studio'
        };
        
        // Show test result
        alert('Test interaction data: ' + JSON.stringify(testData, null, 2));
    }
    
    // Helper functions
    function getFieldValue(fieldName) {
        var field = element.querySelector('[name="' + fieldName + '"]');
        return field ? field.value : '';
    }
    
    function getCheckboxValue(fieldName) {
        var field = element.querySelector('[name="' + fieldName + '"]');
        return field ? field.checked : false;
    }
    
    function parseJsonField(fieldName) {
        var value = getFieldValue(fieldName);
        try {
            return JSON.parse(value);
        } catch (e) {
            return [];
        }
    }
    
    // Initialize when DOM is ready
    $(function() {
        initializeStudio();
        console.log('InteractiveJSBlock: Studio view ready');
    });
    
    // Return public methods
    return {
        saveBlock: saveBlock,
        showPreview: showPreview,
        hidePreview: hidePreview,
        testInteraction: testInteraction
    };
} 
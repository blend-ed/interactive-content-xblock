/* InteractiveJSBlock Student View JavaScript */

function InteractiveJSBlockView(runtime, element) {
    
    // Initialize the block
    function initializeBlock() {
        console.log('InteractiveJSBlock: Initializing student view');
        
        // Add loading state
        element.classList.add('loading');
        
        // Initialize any existing interactions
        updateInteractionDisplay();
        
        // Remove loading state
        setTimeout(function() {
            element.classList.remove('loading');
        }, 500);
    }
    
    // Update the interaction display
    function updateInteractionDisplay() {
        var interactionCount = element.querySelector('#interaction-count');
        var lastInteraction = element.querySelector('#last-interaction');
        var currentResponse = element.querySelector('#current-response');
        
        if (interactionCount) {
            // This will be updated by the XBlockInterface
            console.log('InteractiveJSBlock: Interaction count element found');
        }
        
        if (lastInteraction) {
            // This will be updated by the XBlockInterface
            console.log('InteractiveJSBlock: Last interaction element found');
        }
        
        if (currentResponse) {
            // This will be updated by the XBlockInterface
            console.log('InteractiveJSBlock: Current response element found');
        }
    }
    
    // Handle successful interaction save
    function handleInteractionSuccess(response) {
        console.log('InteractiveJSBlock: Interaction saved successfully', response);
        
        // Update debug display if available
        if (window.updateDebugInfo) {
            window.updateDebugInfo(response);
        }
        
        // Show success state briefly
        element.classList.add('success');
        setTimeout(function() {
            element.classList.remove('success');
        }, 2000);
    }
    
    // Handle interaction save error
    function handleInteractionError(error) {
        console.error('InteractiveJSBlock: Failed to save interaction', error);
        
        // Show error state briefly
        element.classList.add('error');
        setTimeout(function() {
            element.classList.remove('error');
        }, 3000);
    }
    
    // Override the global submitInteraction function to add logging
    var originalSubmitInteraction = window.submitInteraction;
    window.submitInteraction = function(data) {
        console.log('InteractiveJSBlock: submitInteraction called with data:', data);
        
        // Call the original function
        if (originalSubmitInteraction) {
            originalSubmitInteraction(data);
        }
    };
    
    // Add event listeners for any interactive elements
    function setupEventListeners() {
        // Listen for clicks on interactive elements
        element.addEventListener('click', function(event) {
            // Check if the clicked element has a data-interaction attribute
            var target = event.target;
            if (target.hasAttribute('data-interaction')) {
                var interactionData = target.getAttribute('data-interaction');
                try {
                    var data = JSON.parse(interactionData);
                    console.log('InteractiveJSBlock: Auto-interaction detected:', data);
                    window.submitInteraction(data);
                } catch (e) {
                    console.error('InteractiveJSBlock: Invalid interaction data:', interactionData);
                }
            }
        });
        
        // Listen for form submissions
        var forms = element.querySelectorAll('form');
        forms.forEach(function(form) {
            form.addEventListener('submit', function(event) {
                // Prevent default form submission
                event.preventDefault();
                
                // Collect form data
                var formData = new FormData(form);
                var data = {};
                for (var [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                console.log('InteractiveJSBlock: Form submission detected:', data);
                window.submitInteraction(data);
            });
        });
    }
    
    // Initialize when DOM is ready
    $(function() {
        initializeBlock();
        setupEventListeners();
        
        // Log that the block is ready
        console.log('InteractiveJSBlock: Student view ready');
    });
    
    // Return any public methods if needed
    return {
        updateInteractionDisplay: updateInteractionDisplay,
        handleInteractionSuccess: handleInteractionSuccess,
        handleInteractionError: handleInteractionError
    };
} 
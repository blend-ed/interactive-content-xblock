/* InteractiveJSBlock JavaScript */

function InteractiveJSBlockView(runtime, element) {
    'use strict';
    
    var isStaff = false;
    var blockId = element.getAttribute('data-block-id');
    
    // Initialize the view
    function initializeView() {
        console.log('InteractiveJSBlock: Initializing view');
        
        // Check if user is staff
        var staffPanel = element.querySelector('#staff-panel');
        isStaff = staffPanel !== null;
        
        if (isStaff) {
            console.log('InteractiveJSBlock: Staff view detected');
            initializeStaffView();
        }
        
        // Initialize author's CSS and JS
        initializeAuthorContent();
        
        // Set up global submitInteraction function
        window.submitInteraction = submitInteraction;
        
        console.log('InteractiveJSBlock: View initialized');
    }
    
    // Initialize staff-specific functionality
    function initializeStaffView() {
        // Load all learners data on page load
        loadAllLearnersData();
        
        // Set up refresh and export buttons
        var refreshBtn = element.querySelector('.refresh-btn');
        var exportBtn = element.querySelector('.export-btn');
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadAllLearnersData);
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', exportLearnersData);
        }
    }
    
    // Load all learners data for staff view
    function loadAllLearnersData() {
        if (!isStaff) return;
        
        console.log('InteractiveJSBlock: Loading all learners data');
        
        var handlerUrl = runtime.handlerUrl(element, 'get_all_learners_data');
        
        // Show loading indicator
        var tableBody = element.querySelector('#learners-table-body');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="7" class="loading-data">Loading learners data...</td></tr>';
        }
        
        $.ajax({
            type: 'POST',
            url: handlerUrl,
            data: JSON.stringify({}),
            success: function(response) {
                console.log('InteractiveJSBlock: Received learners data:', response);
                
                if (response.status === 'ok') {
                    if (response.learners && response.learners.length > 0) {
                        displayLearnersTable(response.learners);
                        
                        // Show note about limitations if provided
                        if (response.note) {
                            showMessage(response.note, 'info');
                        }
                    } else {
                        displayLearnersTable([]);
                    }
                } else {
                    console.error('InteractiveJSBlock: Failed to load learners data:', response.message);
                    if (tableBody) {
                        tableBody.innerHTML = '<tr><td colspan="7" class="error-data">Error loading data: ' + response.message + '</td></tr>';
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('InteractiveJSBlock: Error loading learners data:', error);
                console.error('InteractiveJSBlock: XHR status:', xhr.status);
                console.error('InteractiveJSBlock: Response text:', xhr.responseText);
                
                if (tableBody) {
                    tableBody.innerHTML = '<tr><td colspan="7" class="error-data">Error loading data: ' + error + '</td></tr>';
                }
            }
        });
    }
    
    // Display learners data in table
    function displayLearnersTable(learners) {
        var tableBody = element.querySelector('#learners-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (learners.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No learner data available</td></tr>';
            return;
        }
        
        learners.forEach(function(learner) {
            var row = document.createElement('tr');
            row.className = 'learner-row ' + (learner.is_correct ? 'correct' : 'incorrect');
            
            // Student info
            var studentCell = document.createElement('td');
            studentCell.className = 'student-info';
            studentCell.innerHTML = `
                <div class="student-name">${learner.full_name}</div>
                <div class="student-username">@${learner.username}</div>
            `;
            
            // Email
            var emailCell = document.createElement('td');
            emailCell.className = 'student-email';
            emailCell.innerHTML = `<a href="mailto:${learner.email}">${learner.email}</a>`;
            
            // Response data
            var responseCell = document.createElement('td');
            responseCell.className = 'response-data';
            var answer = learner.learner_response && learner.learner_response.answer ? 
                        learner.learner_response.answer : '<em>No answer field</em>';
            responseCell.innerHTML = `
                <div class="response-summary">
                    <strong>Answer:</strong> ${answer}
                </div>
                <details class="response-details">
                    <summary>View Full Response</summary>
                    <pre>${JSON.stringify(learner.learner_response, null, 2)}</pre>
                </details>
            `;
            
            // Score
            var scoreCell = document.createElement('td');
            scoreCell.className = 'score';
            scoreCell.textContent = learner.score;
            
            // Correct status
            var correctCell = document.createElement('td');
            correctCell.className = 'correct-status';
            correctCell.innerHTML = learner.is_correct ? 
                '<span class="status-correct" title="Correct">✓</span>' : 
                '<span class="status-incorrect" title="Incorrect">✗</span>';
            
            // Interaction count
            var countCell = document.createElement('td');
            countCell.className = 'interaction-count';
            countCell.textContent = learner.interaction_count;
            
            // Last interaction
            var timeCell = document.createElement('td');
            timeCell.className = 'last-interaction';
            timeCell.innerHTML = `
                <div class="interaction-time">${learner.last_interaction_time}</div>
            `;
            
            row.appendChild(studentCell);
            row.appendChild(emailCell);
            row.appendChild(responseCell);
            row.appendChild(scoreCell);
            row.appendChild(correctCell);
            row.appendChild(countCell);
            row.appendChild(timeCell);
            
            tableBody.appendChild(row);
        });
    }
    
    // Export learners data as CSV
    function exportLearnersData() {
        if (!isStaff) return;
        
        console.log('InteractiveJSBlock: Exporting learners data');
        
        var exportUrl = runtime.handlerUrl(element, 'export_learners_csv');
        
        // Create a temporary link to trigger download
        var link = document.createElement('a');
        link.href = exportUrl;
        link.download = 'interactive_js_learners.csv';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showMessage('Export started! Check your downloads folder.', 'success');
    }
    
    // Initialize author's CSS and JavaScript content
    function initializeAuthorContent() {
        var cssElement = element.querySelector('#author-css');
        var jsElement = element.querySelector('#author-js');
        
        if (cssElement && cssElement.textContent.trim()) {
            var style = document.createElement('style');
            style.textContent = cssElement.textContent;
            element.appendChild(style);
        }
        
        if (jsElement && jsElement.textContent.trim()) {
            try {
                var script = document.createElement('script');
                script.textContent = jsElement.textContent;
                element.appendChild(script);
            } catch (e) {
                console.error('InteractiveJSBlock: Error executing author JavaScript:', e);
            }
        }
    }
    
    // Global submitInteraction function
    function submitInteraction(data) {
        console.log('InteractiveJSBlock: submitInteraction called with:', data);
        
        if (!runtime || !runtime.handlerUrl) {
            console.error('InteractiveJSBlock: Runtime not available - cannot save interaction');
            return;
        }
        
        var handlerUrl = runtime.handlerUrl(element, 'save_interaction');
        
        $.ajax({
            type: 'POST',
            url: handlerUrl,
            data: JSON.stringify(data),
            success: function(response) {
                console.log('InteractiveJSBlock Success:', response.message);
                
                if (response.status === 'ok') {
                    // Update debug info
                    updateDebugInfo(response);
                    
                    // Show feedback if enabled
                    if (response.show_feedback) {
                        showFeedback(response);
                    }
                    
                    // Update staff panel if staff
                    if (isStaff) {
                        updateStaffPanel(response);
                        // Refresh all learners data
                        loadAllLearnersData();
                    }
                    
                    // Publish grade if auto-grading is enabled
                    if (response.publish_grade) {
                        publishGrade(response.score, response.weight);
                    }
                } else {
                    console.error('InteractiveJSBlock Error:', response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('InteractiveJSBlock: Error saving interaction:', error);
                showError('Failed to save interaction: ' + error);
            }
        });
    }
    
    // Update debug information
    function updateDebugInfo(response) {
        var interactionCount = element.querySelector('#debug-interaction-count');
        var lastInteraction = element.querySelector('#debug-last-interaction');
        var isCorrect = element.querySelector('#debug-is-correct');
        var score = element.querySelector('#debug-score');
        
        if (interactionCount) interactionCount.textContent = response.interaction_count || 0;
        if (lastInteraction) lastInteraction.textContent = response.last_interaction_time || '';
        if (isCorrect) isCorrect.textContent = response.is_correct ? 'Yes' : 'No';
        if (score) {
            var weight = response.weight || 1;
            score.textContent = (response.score || 0) + '/' + weight;
        }
    }
    
    // Show feedback to learner
    function showFeedback(response) {
        var feedbackDisplay = element.querySelector('#feedback-display');
        var statusIcon = element.querySelector('#status-icon');
        var statusText = element.querySelector('#status-text');
        var scoreValue = element.querySelector('#score-value');
        var feedbackMessageText = element.querySelector('#feedback-message-text');
        var feedbackStatus = element.querySelector('#feedback-status');
        
        if (feedbackDisplay && response.is_correct !== undefined) {
            // Update status
            if (response.is_correct) {
                statusIcon.textContent = '✓';
                statusText.textContent = 'Correct';
                feedbackStatus.className = 'feedback-status correct';
            } else {
                statusIcon.textContent = '✗';
                statusText.textContent = 'Incorrect';
                feedbackStatus.className = 'feedback-status incorrect';
            }
            
            // Update score
            if (scoreValue && response.score !== undefined) {
                var weight = response.weight || 1;
                scoreValue.textContent = response.score + '/' + weight;
            }
            
            // Update feedback message
            if (feedbackMessageText && response.feedback_message) {
                feedbackMessageText.textContent = response.feedback_message;
            }
            
            // Show the feedback display
            feedbackDisplay.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(function() {
                feedbackDisplay.style.display = 'none';
            }, 5000);
        }
    }
    
    // Update staff panel
    function updateStaffPanel(response) {
        var staffPanel = element.querySelector('#staff-panel');
        if (!staffPanel) return;
        
        // Update current learner data in staff panel
        var interactionCount = staffPanel.querySelector('.learner-data p:nth-child(5)');
        var lastInteraction = staffPanel.querySelector('.learner-data p:nth-child(6)');
        var isCorrect = staffPanel.querySelector('.learner-data p:nth-child(7)');
        var score = staffPanel.querySelector('.learner-data p:nth-child(8)');
        
        if (interactionCount) interactionCount.innerHTML = '<strong>Interaction Count:</strong> ' + (response.interaction_count || 0);
        if (lastInteraction) lastInteraction.innerHTML = '<strong>Last Interaction:</strong> ' + (response.last_interaction_time || '');
        if (isCorrect) isCorrect.innerHTML = '<strong>Is Correct:</strong> ' + (response.is_correct ? 'Yes' : 'No');
        if (score) {
            var weight = response.weight || 1;
            score.innerHTML = '<strong>Score:</strong> ' + (response.score || 0) + '/' + weight;
        }
    }
    
    // Publish grade
    function publishGrade(score, weight) {
        if (runtime && runtime.publish) {
            var grade = {
                value: score,
                max_value: weight,
                user_id: runtime.user_id
            };
            runtime.publish(element, 'grade', grade);
        }
    }
    
    // Show error message
    function showError(message) {
        console.error('InteractiveJSBlock Error:', message);
        // You can implement a more sophisticated error display here
    }
    
    // Show message
    function showMessage(message, type) {
        var notification = document.createElement('div');
        var backgroundColor = '#28a745'; // success
        if (type === 'error') {
            backgroundColor = '#dc3545';
        } else if (type === 'info') {
            backgroundColor = '#17a2b8';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            max-width: 400px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 8000); // Show info messages longer
    }
    
    // Initialize when DOM is ready
    $(document).ready(function() {
        initializeView();
    });
    
    // Public API
    return {
        submitInteraction: submitInteraction
    };
} 
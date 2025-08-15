# InteractiveJSBlock Enhanced Features

This document describes the enhanced features added to the InteractiveJSBlock to support learner feedback, correct/incorrect responses, and staff visibility.

## New Features

### 1. Learner Feedback and Scoring

#### Auto-Grading System
- **Correct Answers Configuration**: Define correct answers in JSON format in the studio
- **Automatic Evaluation**: Responses are automatically evaluated against correct answers
- **Score Calculation**: Automatic score calculation based on weight and correctness
- **Feedback Messages**: Customizable feedback messages for correct/incorrect responses

#### Example Correct Answers Configuration:
```json
{
  "answer": "4",
  "correct_feedback": "Great job! That's correct.",
  "incorrect_feedback": "Try again. The answer is 4."
}
```

For multiple fields:
```json
{
  "fields": {
    "question1": "yes",
    "question2": "no"
  },
  "correct_feedback": "All answers correct!",
  "incorrect_feedback": "Some answers are incorrect."
}
```

### 2. Learner Experience Enhancements

#### Previous Response Display
- **Show Previous Response**: Learners can see their previous responses when they return
- **Response History**: Complete interaction history is preserved
- **Feedback Display**: Shows correct/incorrect status and scores

#### Real-time Feedback
- **Immediate Feedback**: Feedback is shown immediately after interaction
- **Score Display**: Current score is displayed
- **Status Indicators**: Visual indicators for correct/incorrect responses

### 3. Staff Visibility and Submission History

#### Student View for Staff
- **Staff Panel**: Special panel visible only to staff users
- **Real-time Data**: Live interaction data and statistics
- **Learner Response View**: Complete view of learner responses

#### Instructor Dashboard Integration
- **Course-wide View**: View all InteractiveJSBlock interactions across the course
- **Statistics**: Summary statistics for each block
- **Student Responses**: Detailed view of individual student responses
- **Success Rates**: Calculate and display success rates

#### Enhanced Submission History
- **Learner Information**: Full name, username, and email address for each submission
- **Detailed Responses**: Complete response data with expandable details
- **Interaction Tracking**: Number of interactions per student
- **Timestamps**: Precise submission times with date and time
- **Sorting**: Submissions sorted by most recent first
- **Export Functionality**: Download submission history as CSV

#### CSV Export Features
- **Complete Data**: All submission data including learner information
- **Formatted Output**: Clean CSV format with headers
- **Timestamped Files**: Automatic filename generation with timestamps
- **Email Integration**: Clickable email addresses for easy communication

### 4. Configuration Options

#### Studio Settings
- **Auto Grade Enabled**: Toggle automatic grading
- **Show Feedback to Learners**: Control whether learners see feedback
- **Show Previous Response**: Control whether previous responses are shown
- **Enable Instructor View**: Control instructor dashboard visibility
- **Weight**: Set the weight for grading purposes

## Usage Examples

### Basic Interactive Quiz
```html
<div class="quiz">
  <h3>What is 2 + 2?</h3>
  <input type="number" id="answer" />
  <button onclick="submitAnswer()">Submit</button>
</div>

<script>
function submitAnswer() {
  var answer = document.getElementById('answer').value;
  submitInteraction({
    answer: answer,
    question: 'addition',
    timestamp: new Date().toISOString()
  });
}
</script>
```

### Complex Interactive Exercise
```html
<div class="exercise">
  <h3>Complete the form</h3>
  <input type="text" id="name" placeholder="Your name" />
  <input type="email" id="email" placeholder="Your email" />
  <button onclick="submitForm()">Submit</button>
</div>

<script>
function submitForm() {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  
  submitInteraction({
    name: name,
    email: email,
    completed: true,
    timeSpent: calculateTimeSpent()
  });
}
</script>
```

## Instructor Dashboard Setup

To enable the instructor dashboard, add the following to your Open edX settings:

```python
FEATURES["ENABLE_INTERACTIVE_JS_INSTRUCTOR_VIEW"] = True
OPEN_EDX_FILTERS_CONFIG = {
    "org.openedx.learning.instructor.dashboard.render.started.v1": {
        "fail_silently": False,
        "pipeline": [
            "interactive_html_xblock.extensions.filters.AddInteractiveJSTab",
        ]
    },
}
```

## Submission History Features

### What's Included in Submission History
- **Student Full Name**: Complete name of the learner
- **Username**: System username with @ prefix
- **Email Address**: Clickable email for easy communication
- **Response Summary**: Quick view of the answer provided
- **Full Response Data**: Expandable details showing complete interaction data
- **Score**: Numerical score achieved
- **Correctness**: Visual indicator (✓/✗) for correct/incorrect responses
- **Interaction Count**: Number of times the student has interacted
- **Submission Time**: Date and time of last submission

### CSV Export Format
The exported CSV includes the following columns:
1. Student Name
2. Username
3. Email
4. Answer
5. Score
6. Correct (Yes/No)
7. Feedback Message
8. Interaction Count
9. Last Submission Time
10. Full Response Data (JSON format)

### Export Functionality
- **One-Click Export**: Simple button click to download CSV
- **Automatic Naming**: Files named with block ID and timestamp
- **Complete Data**: All submission information included
- **Formatted Output**: Clean, readable CSV format

## Technical Implementation

### Data Storage
- **Learner Response**: Stored in user state scope
- **Interaction Count**: Tracks number of interactions
- **Score**: Stored as float value
- **Correctness**: Boolean flag for correct/incorrect
- **Feedback Message**: String message for learner

### JavaScript Integration
- **submitInteraction()**: Global function for sending data
- **Runtime Integration**: Proper XBlock runtime integration
- **Error Handling**: Comprehensive error handling and logging

### Security Features
- **Input Validation**: JSON validation for correct answers
- **Access Control**: Staff-only access to instructor views
- **Data Sanitization**: Proper data sanitization and validation

### Database Integration
- **User Information**: Integration with Django User model
- **Enrollment Data**: Access to course enrollment information
- **Email Retrieval**: Secure access to user email addresses

## Migration from Previous Version

The enhanced features are backward compatible. Existing blocks will continue to work without modification. New features are opt-in and can be enabled through studio settings.

## Troubleshooting

### Common Issues

1. **Runtime Not Available Error**
   - Ensure the XBlock is properly initialized
   - Check that the JavaScript is loading correctly

2. **Feedback Not Showing**
   - Verify "Show Feedback to Learners" is enabled
   - Check that auto-grading is configured correctly

3. **Instructor Dashboard Not Visible**
   - Ensure the feature flag is enabled
   - Check that the filter is properly configured

4. **Email Not Displaying**
   - Verify user has email address in profile
   - Check database permissions for user data access

### Debug Mode
Enable debug mode in studio settings to see detailed information about:
- Current response data
- Interaction counts
- Score calculations
- Error messages

## Future Enhancements

Planned features for future releases:
- Advanced grading algorithms
- Peer review integration
- Analytics dashboard
- Real-time notifications
- Mobile optimization
- Bulk email functionality
- Advanced filtering and search
- Performance analytics

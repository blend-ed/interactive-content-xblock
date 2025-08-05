"""
Handle view logic for the InteractiveJSBlock
"""
import json
import datetime
from xblock.core import XBlock
from xblock.validation import ValidationMessage
try:
    from xblock.utils.resources import ResourceLoader
    from xblock.utils.studio_editable import StudioEditableXBlockMixin
except ModuleNotFoundError:  # pragma: no cover
    from xblockutils.resources import ResourceLoader
    from xblockutils.studio_editable import StudioEditableXBlockMixin

from .models import InteractiveJSBlockModelMixin


class InteractiveJSBlockViewMixin(StudioEditableXBlockMixin):
    """
    Handle view logic for InteractiveJSBlock instances
    """

    loader = ResourceLoader(__name__)
    static_js_init = 'InteractiveJSBlockView'

    def student_view(self, context=None):
        """
        Create the student view of the InteractiveJSBlock
        """
        context = context or {}
        context = dict(context)
        
        # Prepare the context for rendering
        context.update({
            'display_name': self.display_name,
            'html_content': self.html_content,
            'css_content': self.css_content,
            'js_content': self.js_content,
            'allowed_external_urls': self.allowed_external_urls,
            'enable_debug_mode': self.enable_debug_mode,
            'learner_response': self.learner_response,
            'interaction_count': self.interaction_count,
            'last_interaction_time': self.last_interaction_time,
        })

        # Load the template
        template = self.loader.render_django_template(
            'templates/student_view.html',
            context=context,
            i18n_service=self._i18n_service(),
        )

        # Create fragment
        fragment = self.build_fragment(
            template=template,
            context=context,
            css=['css/interactive_js_block.css'],
            js=['js/src/interactive_js_block.js'],
            js_init=self.static_js_init,
        )

        return fragment

    def studio_view(self, context=None):
        """
        Create the studio view for editing the InteractiveJSBlock
        """
        context = context or {}
        context = dict(context)
        
        # Prepare the context for studio editing
        context.update({
            'display_name': self.display_name,
            'html_content': self.html_content,
            'css_content': self.css_content,
            'js_content': self.js_content,
            'allowed_external_urls': json.dumps(self.allowed_external_urls),
            'enable_debug_mode': self.enable_debug_mode,
            'auto_grade_enabled': self.auto_grade_enabled,
            'weight': self.weight,
        })

        # Load the studio template
        template = self.loader.render_django_template(
            'templates/studio_view.html',
            context=context,
            i18n_service=self._i18n_service(),
        )

        # Create fragment
        fragment = self.build_fragment(
            template=template,
            context=context,
            css=['css/studio_view.css'],
            js=['js/src/studio_view.js'],
            js_init='StudioView',
        )

        return fragment

    def build_fragment(self, template='', context=None, css=None, js=None, js_init=None):
        """
        Creates a fragment for display.
        """
        context = context or {}
        css = css or []
        js = js or []
        
        from web_fragments.fragment import Fragment
        fragment = Fragment(template)
        
        # Add CSS
        for item in css:
            if item.startswith('/'):
                fragment.add_css_url(item)
            else:
                data = self.loader.load_unicode(item)
                fragment.add_css(data)
        
        # Add JavaScript
        for item in js:
            url = self.runtime.local_resource_url(self, item)
            fragment.add_javascript_url(url)
        
        if js_init:
            fragment.initialize_js(js_init)
        
        return fragment

    def _i18n_service(self):
        """
        Provide the XBlock runtime's i18n service
        """
        service = self.runtime.service(self, 'i18n')
        return service

    @XBlock.json_handler
    def save_interaction(self, data, suffix=''):
        """
        Save learner interaction data from JavaScript
        """
        if not isinstance(data, dict):
            return {'status': 'error', 'message': 'Data must be a JSON object'}
        
        try:
            # Update learner response
            self.learner_response = data
            self.interaction_count += 1
            self.last_interaction_time = datetime.datetime.utcnow().isoformat()
            
            # Handle auto-grading if enabled
            if self.auto_grade_enabled:
                self._handle_auto_grading(data)
            
            return {
                'status': 'ok',
                'message': 'Interaction saved successfully',
                'interaction_count': self.interaction_count
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Failed to save interaction: {str(e)}'
            }

    def _handle_auto_grading(self, data):
        """
        Handle automatic grading based on interaction data
        """
        # Check if the data contains a score or grade
        if 'score' in data:
            score = float(data['score'])
            self.set_score(score)
        elif 'grade' in data:
            grade = float(data['grade'])
            self.set_score(grade)
        elif 'correct' in data:
            # Boolean grading
            score = self.max_score() if data['correct'] else 0.0
            self.set_score(score)

    def validate_field_data(self, validation, data):
        """
        Validate field data in studio
        """
        # Validate HTML content
        if 'html_content' in data and not data['html_content'].strip():
            validation.add(
                ValidationMessage(
                    ValidationMessage.ERROR,
                    'HTML content cannot be empty'
                )
            )
        
        # Validate weight
        if 'weight' in data:
            try:
                weight = int(data['weight'])
                if weight < 0:
                    validation.add(
                        ValidationMessage(
                            ValidationMessage.ERROR,
                            'Weight must be a non-negative integer'
                        )
                    )
            except ValueError:
                validation.add(
                    ValidationMessage(
                        ValidationMessage.ERROR,
                        'Weight must be a valid integer'
                    )
                )
        
        # Validate external URLs
        if 'allowed_external_urls' in data:
            try:
                urls = json.loads(data['allowed_external_urls'])
                if not isinstance(urls, list):
                    validation.add(
                        ValidationMessage(
                            ValidationMessage.ERROR,
                            'Allowed external URLs must be a JSON array'
                        )
                    )
            except json.JSONDecodeError:
                validation.add(
                    ValidationMessage(
                        ValidationMessage.ERROR,
                        'Allowed external URLs must be valid JSON'
                    )
                ) 
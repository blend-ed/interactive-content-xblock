"""
InteractiveJSBlock - A custom Open edX XBlock for creating interactive HTML/CSS/JS content
with learner interaction tracking.
"""

from .xblocks import InteractiveJSBlock

# For backward compatibility, export the main class
__all__ = ['InteractiveJSBlock']

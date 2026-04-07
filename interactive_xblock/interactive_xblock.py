"""
InteractiveXBlock - A custom Open edX XBlock for creating interactive HTML/CSS/JS content
with learner interaction tracking.
"""

from .xblocks import InteractiveXBlock

# For backward compatibility, export the main class
__all__ = ['InteractiveXBlock']

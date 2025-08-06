#!/usr/bin/env python3
"""
Test script to verify the validation fix
"""

def test_validation_fix():
    """Test that the validation method works correctly"""
    try:
        # Mock the validation and XBlock classes
        class MockValidation:
            def add(self, message):
                print(f"Validation message: {message}")
        
        class MockXBlock:
            def __init__(self):
                self.html_content = "Test HTML content"
                self.weight = 1
                self.allowed_external_urls = []
        
        # Import the view mixin
        from interactive_html_xblock.views import InteractiveJSBlockViewMixin
        
        # Create a mock instance
        mock_block = MockXBlock()
        validation = MockValidation()
        
        # Test the validation method
        print("Testing validate_field_data method...")
        
        # This should not raise an error
        InteractiveJSBlockViewMixin.validate_field_data(None, validation, mock_block)
        
        print("✅ Validation test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Validation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing validation fix...")
    print("=" * 50)
    
    success = test_validation_fix()
    
    print("=" * 50)
    if success:
        print("🎉 Validation fix test passed!")
    else:
        print("❌ Validation fix test failed.") 
#!/usr/bin/env python
"""
Simple test for InteractiveJSBlock
"""
import sys
import os

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_import():
    """Test that InteractiveJSBlock can be imported"""
    try:
        from interactive_html_xblock.xblocks import InteractiveJSBlock
        print("✓ InteractiveJSBlock imported successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to import InteractiveJSBlock: {e}")
        return False

def test_instantiation():
    """Test that InteractiveJSBlock can be instantiated"""
    try:
        from interactive_html_xblock.xblocks import InteractiveJSBlock
        
        # Create a mock runtime
        class MockRuntime:
            def service(self, block, service_name):
                return None
        
        # Create a mock element
        class MockElement:
            pass
        
        # Create the XBlock
        xblock = InteractiveJSBlock()
        xblock.runtime = MockRuntime()
        xblock.element = MockElement()
        
        print("✓ InteractiveJSBlock instantiated successfully")
        return True
    except Exception as e:
        print(f"✗ Failed to instantiate InteractiveJSBlock: {e}")
        return False

def test_fields():
    """Test that InteractiveJSBlock has the expected fields"""
    try:
        from interactive_html_xblock.xblocks import InteractiveJSBlock
        
        xblock = InteractiveJSBlock()
        
        # Check that the fields exist
        expected_fields = [
            'display_name', 'html_content', 'css_content', 'js_content',
            'allowed_external_urls', 'enable_debug_mode', 'auto_grade_enabled',
            'weight', 'learner_response', 'interaction_count', 'last_interaction_time'
        ]
        
        for field in expected_fields:
            if hasattr(xblock, field):
                print(f"✓ Field '{field}' exists")
            else:
                print(f"✗ Field '{field}' missing")
                return False
        
        return True
    except Exception as e:
        print(f"✗ Failed to test fields: {e}")
        return False

def test_methods():
    """Test that InteractiveJSBlock has the expected methods"""
    try:
        from interactive_html_xblock.xblocks import InteractiveJSBlock
        
        xblock = InteractiveJSBlock()
        
        # Check that the methods exist
        expected_methods = [
            'student_view', 'studio_view', 'save_interaction', 'max_score'
        ]
        
        for method in expected_methods:
            if hasattr(xblock, method):
                print(f"✓ Method '{method}' exists")
            else:
                print(f"✗ Method '{method}' missing")
                return False
        
        return True
    except Exception as e:
        print(f"✗ Failed to test methods: {e}")
        return False

def test_workbench_scenarios():
    """Test that workbench scenarios are defined"""
    try:
        from interactive_html_xblock.xblocks import InteractiveJSBlock
        
        scenarios = InteractiveJSBlock.workbench_scenarios()
        
        if isinstance(scenarios, list) and len(scenarios) > 0:
            print(f"✓ Workbench scenarios defined: {len(scenarios)} scenarios")
            for i, (title, xml) in enumerate(scenarios):
                print(f"  Scenario {i+1}: {title}")
            return True
        else:
            print("✗ No workbench scenarios defined")
            return False
    except Exception as e:
        print(f"✗ Failed to test workbench scenarios: {e}")
        return False

def main():
    """Run all tests"""
    print("Testing InteractiveJSBlock...")
    print("=" * 50)
    
    tests = [
        test_import,
        test_instantiation,
        test_fields,
        test_methods,
        test_workbench_scenarios
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        print(f"\nRunning {test.__name__}...")
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 
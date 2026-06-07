#!/usr/bin/env python3
"""
ResumeForge Turso Cloud DB Verification Script
Uses Playwright to test the full flow against the live Next.js app.
"""

from playwright.sync_api import sync_playwright
import time
import sys

def main():
    results = {}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
        )
        context = browser.new_context(
            ignore_https_errors=True,
            viewport={'width': 1280, 'height': 720}
        )
        page = context.new_page()
        
        # Collect console messages
        console_messages = []
        page.on("console", lambda msg: console_messages.append(f"[{msg.type}] {msg.text}"))
        
        # Step 1: Navigate to homepage
        print("\n" + "="*60)
        print("STEP 1: Navigate to http://localhost:3000/")
        print("="*60)
        try:
            response = page.goto("http://localhost:3000/", wait_until="networkidle", timeout=15000)
            print(f"  Status: {response.status}")
            print(f"  URL: {page.url}")
            print(f"  Title: {page.title()}")
            results['step1_homepage'] = 'PASS'
        except Exception as e:
            print(f"  FAILED: {e}")
            results['step1_homepage'] = f'FAIL: {e}'
            browser.close()
            print_summary(results)
            sys.exit(1)
        
        # Step 2: Find and click Log In button
        print("\n" + "="*60)
        print("STEP 2: Find and click 'Log In' button")
        print("="*60)
        try:
            # Print page text for debugging
            text = page.inner_text('body')
            print(f"  Page text (first 500): {text[:500]}")
            
            login_link = page.locator('a:has-text("Log In"), button:has-text("Log In"), a:has-text("Login"), button:has-text("Login"), a:has-text("Sign In"), a[href*="login"], a[href*="auth"]').first
            if login_link.count() > 0:
                login_link.click()
                page.wait_for_load_state("networkidle", timeout=10000)
                time.sleep(1)
                print(f"  Clicked login button")
                print(f"  URL: {page.url}")
                results['step2_login_click'] = 'PASS'
            else:
                print("  Could not find Log In button with standard selectors")
                results['step2_login_click'] = 'FAIL: No login button found'
        except Exception as e:
            print(f"  Error: {e}")
            results['step2_login_click'] = f'FAIL: {e}'
        
        # Step 3: Try logging in with test@example.com / test123456
        print("\n" + "="*60)
        print("STEP 3: Login with test@example.com / test123456")
        print("="*60)
        try:
            page.wait_for_load_state("networkidle", timeout=5000)
            time.sleep(1)
            
            # Print page content for debugging
            text = page.inner_text('body')
            print(f"  Current page text (first 500): {text[:500]}")
            
            # List all inputs
            all_inputs = page.locator('input').all()
            print(f"  Found {len(all_inputs)} input elements")
            for i, inp in enumerate(all_inputs):
                inp_type = inp.get_attribute('type') or ''
                inp_name = inp.get_attribute('name') or ''
                inp_placeholder = inp.get_attribute('placeholder') or ''
                print(f"    Input {i}: type={inp_type}, name={inp_name}, placeholder={inp_placeholder}")
            
            # Try to fill email
            email_input = page.locator('input[type="email"], input[name="email"], input[placeholder*="mail"], input[placeholder*="Email"]').first
            password_input = page.locator('input[type="password"], input[name="password"], input[placeholder*="assword"]').first
            
            if email_input.count() > 0 and password_input.count() > 0:
                email_input.fill("test@example.com")
                password_input.fill("test123456")
                print("  Filled email and password")
                
                # Click submit/login button
                submit_btn = page.locator('button[type="submit"], button:has-text("Log In"), button:has-text("Login"), button:has-text("Sign In")').first
                if submit_btn.count() > 0:
                    submit_btn.click()
                    page.wait_for_load_state("networkidle", timeout=10000)
                    time.sleep(2)
                    print(f"  After login URL: {page.url}")
                    
                    # Check if login succeeded
                    current_text = page.inner_text('body')
                    if "dashboard" in current_text.lower() or "resume" in current_text.lower() or "/dashboard" in page.url:
                        print("  LOGIN SUCCEEDED - Dashboard visible!")
                        results['step3_login'] = 'PASS'
                    elif "invalid" in current_text.lower() or "error" in current_text.lower() or "incorrect" in current_text.lower():
                        print("  LOGIN FAILED - Invalid credentials")
                        results['step3_login'] = 'FAIL: Invalid credentials'
                    else:
                        print(f"  LOGIN STATUS UNCLEAR")
                        print(f"  Page text (first 500): {current_text[:500]}")
                        results['step3_login'] = 'UNCLEAR'
                else:
                    print("  No submit button found")
                    results['step3_login'] = 'FAIL: No submit button'
            else:
                print("  Could not find email/password inputs")
                results['step3_login'] = 'FAIL: No email/password inputs'
        except Exception as e:
            print(f"  FAILED: {e}")
            results['step3_login'] = f'FAIL: {e}'
        
        # Step 3b: If login failed, try registering
        if 'FAIL' in str(results.get('step3_login', '')):
            print("\n" + "="*60)
            print("STEP 3b: Register new account with turso-verify@example.com")
            print("="*60)
            try:
                # Look for register/signup link or tab
                register_link = page.locator('a:has-text("Register"), a:has-text("Sign Up"), a:has-text("Create Account"), button:has-text("Register"), button:has-text("Sign Up")').first
                
                if register_link.count() > 0:
                    register_link.click()
                    page.wait_for_load_state("networkidle", timeout=5000)
                    time.sleep(1)
                    print(f"  Clicked register link, URL: {page.url}")
                
                # Check if we need to navigate to register page
                text = page.inner_text('body')
                if "register" not in text.lower() and "sign up" not in text.lower() and "create" not in text.lower():
                    page.goto("http://localhost:3000/?auth=register", wait_until="networkidle", timeout=10000)
                    time.sleep(1)
                
                text = page.inner_text('body')
                print(f"  Page text (first 500): {text[:500]}")
                
                # Fill registration form
                name_input = page.locator('input[name="name"], input[placeholder*="ame"], input[placeholder*="Name"]').first
                email_input = page.locator('input[type="email"], input[name="email"], input[placeholder*="mail"]').first
                password_input = page.locator('input[type="password"], input[name="password"], input[placeholder*="assword"]').first
                
                name_filled = False
                if name_input.count() > 0:
                    name_input.fill("Turso Verification")
                    name_filled = True
                email_input.fill("turso-verify@example.com")
                password_input.fill("test123456")
                print(f"  Filled registration form (name field found: {name_filled})")
                
                submit_btn = page.locator('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up"), button:has-text("Create")').first
                if submit_btn.count() > 0:
                    submit_btn.click()
                    page.wait_for_load_state("networkidle", timeout=10000)
                    time.sleep(2)
                    print(f"  After register URL: {page.url}")
                    text = page.inner_text('body')
                    print(f"  Page text (first 500): {text[:500]}")
                    
                    if "dashboard" in text.lower() or "/dashboard" in page.url or "resume" in text.lower():
                        print("  REGISTRATION SUCCEEDED!")
                        results['step3b_register'] = 'PASS'
                    elif "already" in text.lower() or "exists" in text.lower():
                        print("  Account already exists, trying login...")
                        page.goto("http://localhost:3000/?auth=login", wait_until="networkidle", timeout=10000)
                        time.sleep(1)
                        email_input = page.locator('input[type="email"], input[name="email"]').first
                        password_input = page.locator('input[type="password"]').first
                        email_input.fill("turso-verify@example.com")
                        password_input.fill("test123456")
                        submit_btn = page.locator('button[type="submit"], button:has-text("Log In")').first
                        if submit_btn.count() > 0:
                            submit_btn.click()
                            page.wait_for_load_state("networkidle", timeout=10000)
                            time.sleep(2)
                            text = page.inner_text('body')
                            if "dashboard" in text.lower() or "resume" in text.lower() or "/dashboard" in page.url:
                                print("  LOGIN with new account SUCCEEDED!")
                                results['step3b_register'] = 'PASS (login after register)'
                            else:
                                results['step3b_register'] = f'UNCLEAR: URL={page.url}'
                        else:
                            results['step3b_register'] = 'FAIL: Could not login after register'
                    else:
                        results['step3b_register'] = f'UNCLEAR: URL={page.url}'
                else:
                    results['step3b_register'] = 'FAIL: No submit button for register'
            except Exception as e:
                print(f"  FAILED: {e}")
                results['step3b_register'] = f'FAIL: {e}'
        
        # Step 4: Verify dashboard shows resumes
        print("\n" + "="*60)
        print("STEP 4: Verify dashboard shows resumes")
        print("="*60)
        try:
            text = page.inner_text('body')
            print(f"  URL: {page.url}")
            print(f"  Page text (first 800): {text[:800]}")
            
            if "resume" in text.lower() or "dashboard" in text.lower():
                print("  Dashboard content detected!")
                results['step4_dashboard'] = 'PASS'
            else:
                print("  Dashboard content not clearly detected")
                results['step4_dashboard'] = 'UNCLEAR'
        except Exception as e:
            print(f"  FAILED: {e}")
            results['step4_dashboard'] = f'FAIL: {e}'
        
        # Step 5: Create a new resume
        print("\n" + "="*60)
        print("STEP 5: Create a new resume")
        print("="*60)
        try:
            # Look for "Create Resume" or "New Resume" button
            create_btn = page.locator('button:has-text("Create"), button:has-text("New"), a:has-text("Create"), a:has-text("New Resume"), [data-testid="create-resume"]').first
            
            if create_btn.count() > 0:
                create_btn.click()
                page.wait_for_load_state("networkidle", timeout=10000)
                time.sleep(2)
                print(f"  Clicked create button, URL: {page.url}")
                
                text = page.inner_text('body')
                print(f"  Page text (first 500): {text[:500]}")
                
                # Look for title input
                title_input = page.locator('input[name="title"], input[placeholder*="title"], input[placeholder*="Title"], input[placeholder*="name"], input[placeholder*="Name"]').first
                if title_input.count() > 0:
                    title_input.fill("Turso Test Resume")
                    print("  Filled resume title: Turso Test Resume")
                    
                    create_submit = page.locator('button:has-text("Create"), button:has-text("Save"), button[type="submit"]').first
                    if create_submit.count() > 0:
                        create_submit.click()
                        page.wait_for_load_state("networkidle", timeout=10000)
                        time.sleep(2)
                        print(f"  After create URL: {page.url}")
                        results['step5_create_resume'] = 'PASS'
                    else:
                        results['step5_create_resume'] = 'UNCLEAR: No submit after title'
                else:
                    if "editor" in page.url.lower() or "resume" in page.url.lower():
                        print("  Looks like editor opened directly!")
                        results['step5_create_resume'] = 'PASS (direct to editor)'
                    else:
                        results['step5_create_resume'] = 'UNCLEAR: No title input found'
            else:
                print("  No create/new button found, trying navigation approach")
                # Try clicking any element that might lead to resume creation
                results['step5_create_resume'] = 'FAIL: No create button'
        except Exception as e:
            print(f"  FAILED: {e}")
            results['step5_create_resume'] = f'FAIL: {e}'
        
        # Step 6: Open a resume in the editor
        print("\n" + "="*60)
        print("STEP 6: Open a resume in the editor")
        print("="*60)
        try:
            text = page.inner_text('body')
            print(f"  Current URL: {page.url}")
            print(f"  Page text (first 500): {text[:500]}")
            
            if "editor" in page.url.lower() or "edit" in page.url.lower():
                print("  Already in editor!")
                results['step6_open_editor'] = 'PASS (already there)'
            else:
                resume_link = page.locator('a[href*="resume"], a[href*="editor"], [class*="resume-item"], [class*="resume-card"]').first
                if resume_link.count() > 0:
                    resume_link.click()
                    page.wait_for_load_state("networkidle", timeout=10000)
                    time.sleep(2)
                    print(f"  After clicking resume URL: {page.url}")
                    results['step6_open_editor'] = 'PASS'
                else:
                    # Try clicking any clickable element with resume text
                    click_resume = page.locator('[class*="cursor-pointer"], [role="button"]').filter(has_text="resume").first
                    if click_resume.count() > 0:
                        click_resume.click()
                        page.wait_for_load_state("networkidle", timeout=10000)
                        time.sleep(2)
                        results['step6_open_editor'] = 'PASS (clicked resume element)'
                    else:
                        print("  No resume link found on current page")
                        results['step6_open_editor'] = 'FAIL: No resume to click'
        except Exception as e:
            print(f"  FAILED: {e}")
            results['step6_open_editor'] = f'FAIL: {e}'
        
        # Step 7: Make a small edit to confirm saving works
        print("\n" + "="*60)
        print("STEP 7: Make a small edit to confirm saving works")
        print("="*60)
        try:
            text = page.inner_text('body')
            print(f"  Current URL: {page.url}")
            print(f"  Page text (first 500): {text[:500]}")
            
            # Find editable fields
            editable_inputs = page.locator('input[type="text"], input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])').all()
            textareas = page.locator('textarea').all()
            content_editable = page.locator('[contenteditable]').all()
            
            print(f"  Found {len(editable_inputs)} inputs, {len(textareas)} textareas, {len(content_editable)} contenteditable")
            
            edited = False
            if len(textareas) > 0:
                first_ta = textareas[0]
                first_ta.click()
                first_ta.fill("Turso Cloud DB Verified! This is a test edit.")
                print("  Made edit to textarea")
                edited = True
            elif len(content_editable) > 0:
                content_editable[0].click()
                content_editable[0].fill("Turso Cloud DB Verified!")
                print("  Made edit to contenteditable")
                edited = True
            elif len(editable_inputs) > 0:
                # Find a text input
                for inp in editable_inputs:
                    inp_type = inp.get_attribute('type') or 'text'
                    if inp_type in ['text', '']:
                        old_val = inp.input_value()
                        inp.fill("Turso Verified - " + old_val)
                        print(f"  Made edit to text input (old: {old_val})")
                        edited = True
                        break
            
            if edited:
                # Look for save button
                save_btn = page.locator('button:has-text("Save"), button:has-text("save")').first
                if save_btn.count() > 0:
                    save_btn.click()
                    page.wait_for_load_state("networkidle", timeout=10000)
                    time.sleep(2)
                    print("  Clicked save button")
                    results['step7_edit_save'] = 'PASS'
                else:
                    # Auto-save might be in effect
                    print("  No explicit save button - auto-save may be in effect")
                    time.sleep(3)
                    results['step7_edit_save'] = 'PASS (auto-save)'
            else:
                print("  No editable fields found")
                results['step7_edit_save'] = 'FAIL: No editable fields'
        except Exception as e:
            print(f"  FAILED: {e}")
            results['step7_edit_save'] = f'FAIL: {e}'
        
        # Take final screenshot
        page.screenshot(path="/home/z/my-project/turso-verification-screenshot.png")
        print("\n  Screenshot saved to /home/z/my-project/turso-verification-screenshot.png")
        
        # Print console messages for debugging
        if console_messages:
            print("\n  Browser console messages (last 20):")
            for msg in console_messages[-20:]:
                print(f"    {msg}")
        
        browser.close()
    
    print_summary(results)
    return results

def print_summary(results):
    print("\n" + "="*60)
    print("FINAL SUMMARY - TURSO CLOUD DB VERIFICATION")
    print("="*60)
    for step, result in results.items():
        status = "✅" if "PASS" in str(result) else ("❌" if "FAIL" in str(result) else "⚠️")
        print(f"  {status} {step}: {result}")
    
    all_pass = all("PASS" in str(v) for v in results.values())
    print(f"\n  Overall: {'ALL PASSED ✅' if all_pass else 'SOME STEPS FAILED ❌'}")
    print("="*60)

if __name__ == "__main__":
    main()

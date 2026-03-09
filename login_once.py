from playwright.sync_api import sync_playwright

def save_login_session():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        # Open login page
        page.goto("https://gustudent.icloudems.com/")
        print("Login manually now...")
        print("Wait until you see FULL dashboard loaded.")

        # Wait until dashboard URL appears
        page.wait_for_url("**student_index.php**", timeout=120000)

        print("Dashboard detected. Saving session...")

        # Save session
        context.storage_state(path="auth.json")

        print("auth.json saved successfully!")

        browser.close()

if __name__ == "__main__":
    save_login_session()
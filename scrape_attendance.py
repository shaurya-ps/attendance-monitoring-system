from playwright.sync_api import sync_playwright
import json
import datetime


def scrape_attendance():

    with sync_playwright() as p:

        # Launch browser (visible for stability)
        browser = p.chromium.launch(headless=False)

        context = browser.new_context(storage_state="auth.json")
        page = context.new_page()

        # Open dashboard
        page.goto("https://gustudent.icloudems.com/corecampus/student/student_index.php")

        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(5000)

        # Check if session expired
        if "login" in page.url.lower():
            print("Session expired. Run login_once.py again.")
            browser.close()
            return

        print("Dashboard loaded")

        # Click Attendance
        page.wait_for_selector("text=Attendance", timeout=60000)
        page.click("text=Attendance")

        page.wait_for_timeout(3000)

        # Click Course Wise Attendance
        page.wait_for_selector("text=Course Wise Attendance", timeout=60000)
        page.click("text=Course Wise Attendance")

        page.wait_for_timeout(3000)

        # Click Search
        page.wait_for_selector("text=Search", timeout=60000)
        page.click("text=Search")

        page.wait_for_timeout(5000)

        # Get rows
        rows = page.query_selector_all("table tbody tr")

        subjects = {}

        for row in rows:

            cols = row.query_selector_all("td")

            if len(cols) >= 5:

                subject = cols[1].inner_text().strip()
                course_type = cols[2].inner_text().strip()

                ratio = cols[4].inner_text().strip()

                attended, total = ratio.split("/")
                attended = int(attended)
                total = int(total)

                if subject not in subjects:
                    subjects[subject] = {
                        "subject": subject,
                        "theory_total": 0,
                        "theory_attended": 0,
                        "lab_total": 0,
                        "lab_attended": 0
                    }

                if "PP" in course_type:
                    subjects[subject]["theory_total"] += total
                    subjects[subject]["theory_attended"] += attended

                if "PR" in course_type:
                    subjects[subject]["lab_total"] += total
                    subjects[subject]["lab_attended"] += attended

        attendance_data = list(subjects.values())

        # Save JSON with update time
        data = {
            "last_updated": datetime.datetime.now().strftime("%d %b %Y • %I:%M:%S %p"),
            "subjects": attendance_data
        }

        with open("attendance.json", "w") as f:
            json.dump(data, f, indent=4)

        print("Attendance updated at:", data["last_updated"])

        browser.close()


if __name__ == "__main__":
    scrape_attendance()
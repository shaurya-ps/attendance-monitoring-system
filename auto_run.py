import subprocess

print("Starting Automatic Attendance Update...")

# Run scraper only
subprocess.run(["python", "scrape_attendance.py"])

print("Attendance successfully updated.")
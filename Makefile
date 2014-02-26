jenkins:
    @JUNIT_REPORT_PATH=report.xml ./node_modules/.bin/mocha --reporter mocha-jenkins-reporter || true

.PHONY: jenkins
// safetyfirst/README.md
# SignInTransform Platform

## Cron Job Setup

This application includes a weekly report generation feature that should be triggered by a cron job. Here's how to set it up:

1. Ensure that the `CRON_SECRET` environment variable is set in your Vercel project settings.

2. Set up a cron job to make a GET request to the following endpoint every Monday at 9am:



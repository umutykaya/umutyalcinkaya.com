You are an expert AWS DevOps engineer. Your task is to write and execute a complete 
shell script that automates the following AWS infrastructure steps for the domain 
"umutykaya.com". Treat the domain name as a dynamic variable (DOMAIN) so the script 
is reusable.

## Context
- The Amplify app is already deployed. You will be given the APP_ID and the target 
  branch name (default: "main").
- The Route 53 hosted zone for the domain exists in the same AWS account.
- AWS CLI v2 is installed and credentials are configured with sufficient IAM permissions 
  (amplify:*, acm:*, cloudfront:*, route53:*).
- Region for Amplify/ACM must be us-east-1 (CloudFront requirement).

## Task Steps

### Step 1 — Attach domain to Amplify's CloudFront distribution
Use `aws amplify create-domain-association` to associate $DOMAIN with the Amplify app.
Use AMPLIFY_MANAGED certificate type so Amplify automatically provisions a wildcard 
ACM SSL certificate for *.$DOMAIN and $DOMAIN.
Include both the root domain (prefix="") and www subdomain (prefix="www") in 
sub-domain-settings, both mapped to the main branch.

### Step 2 — Wildcard SSL Certificate
This is handled automatically by the AMPLIFY_MANAGED certificate setting in Step 1.
No separate ACM command is needed. Confirm the certificate ARN in the domain 
association response and print it.

### Step 3 — CNAME registration in Route 53
Because the Route 53 hosted zone is in the same AWS account, Amplify automatically 
creates the necessary CNAME validation records and the CloudFront alias record.
After calling create-domain-association, retrieve and print the certificateVerificationDNSRecord 
from the response so the operator can verify them if needed.

### Step 4 — Wait for successful registration, then create a CloudFront invalidation
Poll `aws amplify get-domain-association` every 30 seconds.
Print the current domainStatus on each poll.
Once status is "AVAILABLE", stop polling.
Then retrieve the Amplify app's default CloudFront distribution domain 
(from `aws amplify get-app`) and find the matching CloudFront distribution ID 
using `aws cloudfront list-distributions`.
Finally, call `aws cloudfront create-invalidation --paths "/*"` on that distribution ID.
Print the invalidation ID and status upon completion.

## Output Requirements
- Write a single, clean bash script named `amplify-domain-setup.sh`.
- Use strict mode: `set -euo pipefail`.
- Accept APP_ID, DOMAIN, and BRANCH as environment variables with sensible defaults.
- Add clear section comments for each of the 4 steps.
- Print timestamped progress messages at each stage.
- Handle errors gracefully: if the domain association already exists, skip creation 
  and proceed to polling.
- At the end, print a success summary showing: domain name, certificate ARN, 
  CloudFront distribution ID, and invalidation ID.

## Variables (fill these in before running)
DOMAIN="umutykaya.com"
APP_ID="<your-amplify-app-id>"
BRANCH="main"

Write the complete script, then explain any IAM permissions the executing role 
must have, and note any edge cases (e.g., domain already associated, certificate 
stuck in PENDING_VALIDATION, CloudFront distribution not yet propagated).
# Flora AWS Deployment - Quick Start Guide

## 📚 Documentation Overview

**Start here** → Quick deployment guide
**Deep dive** → See other docs for detailed explanations

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `QUICK_START.md` (this file) | Deploy to AWS step-by-step | First time setup |
| `ARCHITECTURE.md` | How Terraform works, file connections | Understanding the system |
| `DOCKER_DEPLOYMENT.md` | Docker strategy for AWS | Understanding build process |
| `DOCKER_COMMANDS_EXPLAINED.md` | Local vs AWS Docker commands | Troubleshooting |
| `README.md` | Full reference documentation | Looking up specific tasks |

## 📋 Prerequisites

### Required Tools

```bash
# Check what you have
aws --version        # Need: AWS CLI v2
terraform --version  # Need: v1.0+
eb --version         # Need: EB CLI
docker --version     # Need: Docker

# Install missing tools
brew install awscli terraform
pip install awsebcli
```

### AWS Account Setup

1. **Student Account:** Use AWS Educate/Academy for free tier
2. **Access Keys:** IAM → Users → Create access key
3. **Configure CLI:**
   ```bash
   aws configure
   # AWS Access Key ID: AKIA...
   # AWS Secret Access Key: ...
   # Default region: ap-southeast-2 (Sydney)
   # Default output format: json
   ```

## 🚀 Step-by-Step Deployment

### Step 1: Configure Secrets

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with secrets

```hcl
# Database - set it yourself
database_username = "flora_admin"
database_password = "ChangeMe_SecurePassword123!"  # Strong password!

# Auth0 (from your .env files)
auth0_client_secret = "YOUR_SECRET_FROM_AUTH0_DASHBOARD"

# Stripe (from your .env files)
stripe_secret_key = "sk_test_YOUR_KEY_HERE"
stripe_publishable_key = "pk_test_YOUR_KEY_HERE"
```

### Step 2: Create AWS Infrastructure

```bash
# Initialize Terraform (downloads AWS provider)
terraform init

# Preview what will be created
terraform plan

# Create infrastructure (takes ~10 minutes)
terraform apply
```

**Type `yes` when prompted.**

**What gets created:**
```
Creating infrastructure...
✅ VPC and networking (30 seconds)
✅ RDS PostgreSQL database (5 minutes)
✅ Elastic Beanstalk environment (4 minutes)
✅ S3 bucket + CloudFront (1 minute)

Total: ~10 - 15 minutes
```

**Save the outputs:**
```bash
# After terraform apply completes
terraform output
```

You'll see:
```
backend_api_url = "http://flora-backend-production.xxx.elasticbeanstalk.com"
frontend_cloudfront_url = "https://d1234abcd.cloudfront.net"
frontend_s3_bucket = "flora-frontend-production-abc123"
```

### Step 3: Deploy Backend

**Option A: Using deployment script (recommended)**

```bash
./scripts/deploy-backend.sh
```

**Option B: Manual deployment**

```bash
cd ../apps/backend

# Initialize EB CLI
eb init -p docker -r ap-southeast-2 flora-backend
eb use flora-backend-production

# Create Dockerrun.aws.json
cat > Dockerrun.aws.json <<'EOF'
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": ".",
    "Update": "true"
  },
  "Ports": [
    {
      "ContainerPort": 3001,
      "HostPort": 80
    }
  ]
}
EOF

# Deploy
eb deploy
```

**What happens:**
1. EB CLI zips your code + Dockerfile
2. Uploads to AWS S3
3. EC2 instance pulls and builds Docker image (using `apps/backend/Dockerfile`)
4. Runs container with environment variables from Terraform
5. Takes ~5 minutes

### Step 4: Run Database Migrations

```bash
# SSH into EB instance
eb ssh

# Find running container
docker ps

# Run migrations
docker exec $(docker ps -q) npx prisma migrate deploy
docker exec $(docker ps -q) npx prisma db seed

# Exit
exit
```

### Step 5: Deploy Frontend

**Set Stripe key first:**
```bash
export VITE_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY"
```

**Option A: Using deployment script (recommended)**

```bash
cd ../../terraform
./scripts/deploy-frontend.sh
```

**Option B: Manual deployment**

```bash
cd ../apps/frontend

# Get backend URL
BACKEND_URL=$(cd ../../terraform && terraform output -raw backend_api_url)

# Build with Docker (same Dockerfile as local dev)
docker build \
  --build-arg VITE_API_URL="${BACKEND_URL}/api" \
  --build-arg VITE_AUTH0_DOMAIN="dev-ijvur34mojpovh8e.us.auth0.com" \
  --build-arg VITE_AUTH0_CLIENT_ID="tegmEuc40IvXfYFDLIRnJmbsa1izkTVL" \
  --build-arg VITE_AUTH0_AUDIENCE="https://flora-api.com" \
  --build-arg VITE_STRIPE_PUBLISHABLE_KEY="$VITE_STRIPE_PUBLISHABLE_KEY" \
  -t flora-frontend-prod \
  -f Dockerfile \
  ../../

# Extract built files
docker create --name temp flora-frontend-prod
docker cp temp:/app/apps/frontend/dist ./dist-aws
docker rm temp

# Upload to S3
S3_BUCKET=$(cd ../../terraform && terraform output -raw frontend_s3_bucket)
aws s3 sync dist-aws/ s3://$S3_BUCKET/ --delete

# Invalidate CloudFront cache
CLOUDFRONT_ID=$(cd ../../terraform && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"

# Cleanup
rm -rf dist-aws
```

**What happens:**
1. Docker builds frontend (same as local: `pnpm docker:prod`)
2. Extracts `dist/` folder from Docker image
3. Uploads static files to S3
4. CloudFront distributes globally
5. Takes ~3 minutes

### Step 6: Test Your Deployment

```bash
# Get URLs
terraform output frontend_cloudfront_url
terraform output backend_api_url

# Test backend health
curl $(terraform output -raw backend_api_url)/api/health

# Visit frontend
# Open the CloudFront URL in your browser
```

## 🔄 Updating Your Application

### Update Backend Code

```bash
cd apps/backend
# Make your code changes
eb deploy
```

### Update Frontend Code

```bash
# Set Stripe key (if not already in env)
export VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Run deployment script
cd terraform
./scripts/deploy-frontend.sh
```

### Update Infrastructure

```bash
cd terraform
# Edit .tf files (e.g., increase RDS storage)
terraform plan  # Preview changes
terraform apply # Apply changes
```

## 🧹 Cleanup / Delete Everything

**WARNING:** This deletes ALL resources and data!

```bash
cd terraform
terraform destroy
# Type 'yes' to confirm
```

**What gets deleted:**
- All EC2 instances
- RDS database (and all data!)
- S3 bucket (and all files!)
- CloudFront distribution
- VPC and networking

Takes ~10 minutes.

## 💰 Cost Breakdown

### Free Tier (First 12 Months)

| Resource | Free Tier | Your Usage | Cost |
|----------|-----------|------------|------|
| EC2 (t2.micro) | 750 hrs/month | 1 instance 24/7 = 720 hrs | $0 |
| RDS (db.t3.micro) | 750 hrs/month | 1 instance 24/7 = 720 hrs | $0 |
| S3 | 5 GB storage | ~500 MB | $0 |
| CloudFront | 50 GB transfer | ~10 GB | $0 |
| **Total** | | | **$0/month** |

### After Free Tier

| Resource | Monthly Cost |
|----------|-------------|
| EC2 t2.micro | ~$8 |
| RDS db.t3.micro | ~$15 |
| S3 + CloudFront | ~$2 |
| **Total** | **~$25/month** |

### Cost Optimization Tips

1. **Stop when not demoing:**
   ```bash
   terraform destroy  # Delete everything
   terraform apply    # Recreate when needed
   ```

2. **Use AWS Academy credits** (students get $100/year)

3. **Set billing alerts** (AWS Console → Billing → Budgets)

## ❓ Troubleshooting

### Terraform errors

```bash
# AWS credentials issue
aws sts get-caller-identity  # Should show your account

# State lock issue
terraform force-unlock <LOCK_ID>

# Start fresh
rm -rf .terraform terraform.tfstate*
terraform init
```

### Backend won't deploy

```bash
# Check EB logs
cd apps/backend
eb logs

# Check environment health
eb health

# SSH and debug
eb ssh
docker logs $(docker ps -q)
```

### Frontend not loading

```bash
# Check if files uploaded
aws s3 ls s3://$(terraform output -raw frontend_s3_bucket)

# Check CloudFront status
aws cloudfront get-distribution \
  --id $(terraform output -raw cloudfront_distribution_id)

# Re-invalidate cache
aws cloudfront create-invalidation \
  --distribution-id $(terraform output -raw cloudfront_distribution_id) \
  --paths "/*"
```

### Database connection fails

```bash
# Get RDS endpoint
terraform output database_endpoint

# Check from EB instance
eb ssh
docker exec -it $(docker ps -q) sh
env | grep DATABASE_URL
```

## 📞 Need Help?

1. **Terraform Docs:** https://registry.terraform.io/providers/hashicorp/aws/latest/docs
2. **EB CLI Docs:** https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html
3. **AWS Free Tier:** https://aws.amazon.com/free/

## ✅ Checklist

Before presenting/demoing:

- [ ] Terraform apply completed successfully
- [ ] Backend deployed and healthy (`eb health`)
- [ ] Database migrated and seeded
- [ ] Frontend deployed to S3
- [ ] CloudFront cache invalidated
- [ ] Frontend loads in browser
- [ ] Backend API responds to health check
- [ ] Can log in with Auth0
- [ ] Can add items to cart
- [ ] Payment flow works (Stripe test mode)

## 🎓 For Your Portfolio

Mention in interviews:

- ✅ Infrastructure as Code (Terraform)
- ✅ AWS multi-service architecture (RDS, EB, S3, CloudFront)
- ✅ Docker containerization (consistent dev → prod)
- ✅ CI/CD automation
- ✅ Cost optimization (free tier usage)
- ✅ Security best practices (private subnets, security groups)

This demonstrates strong **DevOps** and **Cloud Engineering** skills!

#!/bin/bash

# ====================================
# Cloud Run Deployment Script
# ====================================
# This script helps deploy the Yalla Allemagne application to Google Cloud Run
# with Secret Manager integration.
#
# Usage:
#   ./deploy.sh [command]
#
# Commands:
#   setup       - Initial setup (create secrets, repositories)
#   build       - Build and push Docker image manually
#   deploy      - Deploy to Cloud Run
#   update-env  - Update environment variables
#   logs        - View service logs
#   info        - Display service information
#   clean       - Delete all resources
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - Docker installed (for manual builds)
#   - Required APIs enabled

set -e  # Exit on error

# ====================================
# Configuration
# ====================================

# Set these variables according to your project
PROJECT_ID="${PROJECT_ID:-your-project-id}"
REGION="${REGION:-europe-west1}"
SERVICE_NAME="${SERVICE_NAME:-yalla-allemagne}"
REPO_NAME="${REPO_NAME:-yalla-allemagne-repo}"
SECRET_NAME="openrouter-api-key"

# Cloud Run configuration
MEMORY="512Mi"
CPU="1"
MIN_INSTANCES="0"
MAX_INSTANCES="10"
TIMEOUT="300s"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ====================================
# Helper Functions
# ====================================

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check gcloud
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI not found. Please install: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    # Check if logged in
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
        print_error "Not authenticated with gcloud. Run: gcloud auth login"
        exit 1
    fi
    
    # Check project ID
    if [ "$PROJECT_ID" == "your-project-id" ]; then
        print_error "Please set PROJECT_ID environment variable or edit this script"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# ====================================
# Setup Functions
# ====================================

setup_project() {
    print_info "Setting up Google Cloud project..."
    
    # Set project
    gcloud config set project $PROJECT_ID
    
    # Enable required APIs
    print_info "Enabling required APIs..."
    gcloud services enable \
        cloudbuild.googleapis.com \
        run.googleapis.com \
        secretmanager.googleapis.com \
        artifactregistry.googleapis.com
    
    print_success "APIs enabled"
}

create_artifact_registry() {
    print_info "Creating Artifact Registry repository..."
    
    if gcloud artifacts repositories describe $REPO_NAME --location=$REGION &> /dev/null; then
        print_warning "Repository already exists"
    else
        gcloud artifacts repositories create $REPO_NAME \
            --repository-format=docker \
            --location=$REGION \
            --description="Docker repository for Yalla Allemagne"
        print_success "Artifact Registry created"
    fi
    
    # Configure Docker auth
    gcloud auth configure-docker ${REGION}-docker.pkg.dev
}

create_secret() {
    print_info "Creating Secret Manager secret..."
    
    if gcloud secrets describe $SECRET_NAME &> /dev/null; then
        print_warning "Secret already exists. To update, use: ./deploy.sh update-secret"
    else
        # Prompt for API key
        echo -n "Enter your OpenRouter API key: "
        read -s API_KEY
        echo
        
        echo -n "$API_KEY" | gcloud secrets create $SECRET_NAME \
            --data-file=- \
            --replication-policy="automatic"
        
        # Grant Cloud Run access
        PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
        SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
        
        gcloud secrets add-iam-policy-binding $SECRET_NAME \
            --member="serviceAccount:${SERVICE_ACCOUNT}" \
            --role="roles/secretmanager.secretAccessor"
        
        print_success "Secret created and permissions granted"
    fi
}

setup_all() {
    check_prerequisites
    setup_project
    create_artifact_registry
    create_secret
    print_success "Setup complete! You can now run: ./deploy.sh deploy"
}

# ====================================
# Build Functions
# ====================================

build_and_push() {
    print_info "Building and pushing Docker image..."
    
    check_prerequisites
    gcloud config set project $PROJECT_ID
    
    IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}"
    
    # Build image
    print_info "Building Docker image..."
    docker build -t ${IMAGE_NAME}:latest .
    
    # Push image
    print_info "Pushing to Artifact Registry..."
    docker push ${IMAGE_NAME}:latest
    
    print_success "Image built and pushed: ${IMAGE_NAME}:latest"
}

# ====================================
# Deploy Functions
# ====================================

deploy_service() {
    print_info "Deploying to Cloud Run..."
    
    check_prerequisites
    gcloud config set project $PROJECT_ID
    
    IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
    
    # Get service URL (if exists)
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format='value(status.url)' 2>/dev/null || echo "")
    
    if [ -z "$SERVICE_URL" ]; then
        SERVICE_URL="https://${SERVICE_NAME}-xxxxx-${REGION}.a.run.app"
        print_warning "First deployment - update NEXT_PUBLIC_SITE_URL after deployment"
    fi
    
    # Deploy
    gcloud run deploy $SERVICE_NAME \
        --image=$IMAGE_NAME \
        --platform=managed \
        --region=$REGION \
        --allow-unauthenticated \
        --port=8080 \
        --memory=$MEMORY \
        --cpu=$CPU \
        --min-instances=$MIN_INSTANCES \
        --max-instances=$MAX_INSTANCES \
        --timeout=$TIMEOUT \
        --set-env-vars="NODE_ENV=production,NEXT_PUBLIC_SITE_URL=${SERVICE_URL}" \
        --set-secrets="REACT_APP_OPENROUTER_API_KEY=${SECRET_NAME}:latest"
    
    # Get actual service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format='value(status.url)')
    
    print_success "Deployment complete!"
    print_info "Service URL: ${SERVICE_URL}"
    print_info "Health check: ${SERVICE_URL}/api/health"
}

# ====================================
# Management Functions
# ====================================

update_environment() {
    print_info "Updating environment variables..."
    
    check_prerequisites
    gcloud config set project $PROJECT_ID
    
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format='value(status.url)')
    
    gcloud run services update $SERVICE_NAME \
        --region=$REGION \
        --update-env-vars="NEXT_PUBLIC_SITE_URL=${SERVICE_URL}"
    
    print_success "Environment variables updated"
}

update_secret() {
    print_info "Updating secret..."
    
    check_prerequisites
    gcloud config set project $PROJECT_ID
    
    echo -n "Enter new OpenRouter API key: "
    read -s API_KEY
    echo
    
    echo -n "$API_KEY" | gcloud secrets versions add $SECRET_NAME --data-file=-
    
    print_success "Secret updated. Cloud Run will use the new version on next deployment."
}

view_logs() {
    print_info "Viewing service logs (Ctrl+C to exit)..."
    
    check_prerequisites
    gcloud config set project $PROJECT_ID
    
    gcloud run services logs tail $SERVICE_NAME --region=$REGION
}

show_info() {
    print_info "Service Information:"
    
    check_prerequisites
    gcloud config set project $PROJECT_ID
    
    echo
    echo "Project ID: $PROJECT_ID"
    echo "Region: $REGION"
    echo "Service Name: $SERVICE_NAME"
    echo
    
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format='value(status.url)' 2>/dev/null || echo "Not deployed")
    
    echo "Service URL: $SERVICE_URL"
    echo "Health Check: ${SERVICE_URL}/api/health"
    echo
    
    gcloud run services describe $SERVICE_NAME --region=$REGION
}

cleanup() {
    print_warning "This will delete all Cloud Run resources. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_info "Cleaning up resources..."
        
        check_prerequisites
        gcloud config set project $PROJECT_ID
        
        # Delete Cloud Run service
        gcloud run services delete $SERVICE_NAME --region=$REGION --quiet || true
        
        # Delete secret
        gcloud secrets delete $SECRET_NAME --quiet || true
        
        # Delete Artifact Registry repo
        gcloud artifacts repositories delete $REPO_NAME --location=$REGION --quiet || true
        
        print_success "Cleanup complete"
    else
        print_info "Cleanup cancelled"
    fi
}

# ====================================
# Main
# ====================================

show_usage() {
    cat << EOF
Yalla Allemagne - Cloud Run Deployment Script

Usage:
  ./deploy.sh [command]

Commands:
  setup          Initial setup (create secrets, repositories)
  build          Build and push Docker image manually
  deploy         Deploy to Cloud Run
  update-env     Update environment variables
  update-secret  Update API key in Secret Manager
  logs           View service logs
  info           Display service information
  clean          Delete all resources
  help           Show this help message

Environment Variables:
  PROJECT_ID     Google Cloud Project ID (default: $PROJECT_ID)
  REGION         Deployment region (default: $REGION)
  SERVICE_NAME   Cloud Run service name (default: $SERVICE_NAME)

Examples:
  # First time setup
  export PROJECT_ID=my-project
  ./deploy.sh setup
  ./deploy.sh deploy

  # Update deployment
  ./deploy.sh build
  ./deploy.sh deploy

  # View logs
  ./deploy.sh logs

For more information, see DEPLOYMENT.md
EOF
}

# Parse command
case "${1:-help}" in
    setup)
        setup_all
        ;;
    build)
        build_and_push
        ;;
    deploy)
        deploy_service
        ;;
    update-env)
        update_environment
        ;;
    update-secret)
        update_secret
        ;;
    logs)
        view_logs
        ;;
    info)
        show_info
        ;;
    clean)
        cleanup
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_usage
        exit 1
        ;;
esac
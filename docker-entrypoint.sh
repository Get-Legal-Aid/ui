#!/bin/sh

# Docker entrypoint script for GetLegalAid web app
# This script replaces environment variables in the built files at runtime
# allowing the same Docker image to work in different environments

echo "Starting GetLegalAid web application..."

# Replace environment variable placeholders with actual values
# This allows us to use the same Docker image across dev/staging/prod
# by just changing environment variables

# Replace API base URL placeholder with actual environment variable
if [ -n "$VITE_API_BASE_URL" ]; then
    echo "Setting API base URL to: $VITE_API_BASE_URL"
    # Find all JS files and replace the placeholder with actual value
    find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_API_BASE_URL__|$VITE_API_BASE_URL|g" {} +
    find /usr/share/nginx/html -type f -name "*.html" -exec sed -i "s|__VITE_API_BASE_URL__|$VITE_API_BASE_URL|g" {} +
else
    echo "Warning: VITE_API_BASE_URL not set, using placeholder value"
fi

# Add more environment variable replacements here as needed
# Example:
# if [ -n "$VITE_APP_NAME" ]; then
#     find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_APP_NAME__|$VITE_APP_NAME|g" {} +
# fi

echo "Environment variables configured successfully"

# Execute the command passed to docker run (usually nginx)
exec "$@"
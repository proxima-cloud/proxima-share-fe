# Google OAuth Setup Guide

## Current Configuration

**Client ID**: `375598794015-b2fdtubi27kun4ql941mofv4rogkrjhh.apps.googleusercontent.com`

## Required Google Cloud Console Settings

### Authorized JavaScript Origins

Add these origins in Google Cloud Console → APIs & Services → Credentials → Your OAuth 2.0 Client ID:

```
http://localhost:3000
http://localhost
https://proximacloud.in
https://www.proximacloud.in
```

### Authorized Redirect URIs (if using redirect mode)

```
http://localhost:3000
https://proximacloud.in
https://www.proximacloud.in
```

## How to Configure

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Scroll to "Authorized JavaScript origins"
4. Click "ADD URI" and add each origin listed above
5. Click "Save"
6. Wait 1-2 minutes for changes to propagate

## Troubleshooting

- **Error: unregistered_origin**: The current origin is not in the authorized list
- **Error: invalid_client**: Check that the Client ID matches exactly
- After making changes, wait a few minutes before testing again
- Clear browser cache if issues persist

## Notes

- The Client Secret is NOT needed in the frontend `.env` file
- Only the Client ID (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`) is required
- Origins must match exactly (including `http` vs `https` and port numbers)


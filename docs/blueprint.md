# **App Name**: ProximaShare

## Core Features:

- File Upload: File Upload: Allows users to upload files to the server using the `http://proximacloud.ddns.net:8080/api/files/upload` endpoint.
- Download Link: Download Link Generation: Upon successful upload, generates a unique download URL (`http://proximacloud.ddns.net:8080/api/files/download/{uuid}`) using the UUID received in the response.
- Shareable Link: Shareable Link: Provides a direct, copyable link to the download page URL for easy sharing.
- Download Page: Download Page: Creates a dedicated download page where the download link is pre-filled and ready for the user to initiate the download from `http://proximacloud.ddns.net:8080/api/files/download/{uuid}`.
- Read-Only URL: Read-Only Input Field:  On the download page, the input field containing the download URL is set to read-only, ensuring users cannot modify the link.
- Error Message: Error Handling: Displays a user-friendly message 'Something went wrong' when the upload API returns a 400 error.

## Style Guidelines:

- Primary color: Soft sky blue (#87CEEB) evoking feelings of trust and ease of sharing.
- Background color: Light grayish-blue (#F0F8FF), creating a clean and unobtrusive backdrop.
- Accent color: Sunset orange (#E9967A) for calls to action, like the upload and download buttons, injecting a sense of urgency and delight.
- Font: 'Inter', a grotesque-style sans-serif, for a modern and neutral look, suitable for headlines and body text.
- Simple, clear icons to represent file types and actions (upload, download, copy) for intuitive navigation.
- Clean and spacious layout with a focus on ease of use. Drag-and-drop functionality for file uploads.  Prominent display of the generated download link.
- Subtle animations and transitions to provide feedback and enhance the user experience (e.g., progress bar during upload, confirmation animation after successful upload).
# Unsplash API Setup Guide

## Getting Your Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account or sign in
3. Click "New Application"
4. Fill in the application details:
   - Application name: "Event Booking System"
   - Description: "Event booking system with image integration"
   - What are you building?: "A web application for event booking"
5. Accept the terms and create the application
6. Copy your **Access Key**

## Setting Up the API Key

1. Open the file `client/.env`
2. Replace `your_actual_unsplash_access_key_here` with your actual Unsplash Access Key:
   ```
   REACT_APP_UNSPLASH_ACCESS_KEY=your_actual_key_here
   ```
3. Save the file
4. Restart your React development server

## Using the Image Picker

1. Go to your Admin Dashboard
2. Click "Add Event"
3. Fill in the event details
4. In the "Event Image" section:
   - Type a search term (e.g., "concert", "conference", "music")
   - Click "Search"
   - Select an image from the results
   - The selected image URL will be automatically saved
5. Submit the form

## Cleaning Up Old Events

1. In the Admin Dashboard, click "Clean Up Dummy Events"
2. This will remove all events with invalid image URLs
3. You can then add new events with proper images

## Features

- **Search Images**: Search for relevant images by keywords
- **Preview**: See a preview of the selected image
- **Easy Selection**: Click on any image to select it
- **Remove Selection**: Click the X button to remove the selected image
- **Responsive Design**: Works on desktop and mobile

## API Limits

- Unsplash free tier: 50 requests per hour
- Each image search uses 1 request
- Plan your usage accordingly 
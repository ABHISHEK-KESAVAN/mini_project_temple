# Image Troubleshooting Guide

## Common Image Issues

### 1. Images Not Displaying

**Possible Causes:**
- Invalid or broken image URLs
- CORS (Cross-Origin Resource Sharing) issues
- Images not uploaded/accessible
- Network connectivity issues

### 2. How to Fix

#### Option 1: Use Valid Image URLs
Make sure the image URLs you enter in the admin panel are:
- **Publicly accessible** (not behind authentication)
- **Full URLs** starting with `http://` or `https://`
- **Valid image formats** (.jpg, .png, .gif, .webp)

**Examples of valid URLs:**
```
https://example.com/temple-image.jpg
https://images.unsplash.com/photo-1234567890
http://localhost:5000/uploads/temple.jpg (if you set up file uploads)
```

#### Option 2: Use Image Hosting Services
Upload your images to:
- **Imgur**: https://imgur.com (free, easy)
- **Cloudinary**: https://cloudinary.com (free tier available)
- **ImgBB**: https://imgbb.com (free)
- **Google Drive**: Make images public and use direct links

#### Option 3: Local Images (Development)
For local development, you can:
1. Create an `uploads` folder in `backend/uploads`
2. Place images there
3. Use URLs like: `http://localhost:5000/uploads/your-image.jpg`

### 3. Testing Image URLs

Before adding images in admin panel:
1. Open the image URL directly in your browser
2. If it loads, it should work in the website
3. If it doesn't load, find a different image URL

### 4. Error Handling

The code now includes error handling:
- If an image fails to load, it will be hidden
- Placeholder text will show instead
- No broken image icons will appear

### 5. Quick Fixes

**For Temple Logo:**
- Go to Admin → Manage Home Page
- Enter a valid image URL in "Temple Logo URL"
- Save and refresh the home page

**For Banners:**
- Go to Admin → Manage Home Page
- Add banners with valid image URLs
- Each banner needs a complete image URL

**For Pooja Images:**
- Go to Admin → Manage Poojas
- Edit a pooja
- Add image URL (optional)
- Save

### 6. Recommended Image Sizes

- **Temple Logo**: 200x200px (square)
- **Banners**: 1920x400px (wide banner)
- **Pooja Images**: 400x300px (rectangular)

### 7. Free Image Resources

- **Unsplash**: https://unsplash.com (free temple/religious images)
- **Pexels**: https://pexels.com (free stock photos)
- **Pixabay**: https://pixabay.com (free images)

### 8. If Images Still Don't Work

1. **Check Browser Console** (F12):
   - Look for CORS errors
   - Look for 404 (not found) errors
   - Look for network errors

2. **Check Image URL**:
   - Right-click image URL → "Open in new tab"
   - If it doesn't open, the URL is invalid

3. **Try Different Image**:
   - Use a known working image URL (like from Unsplash)
   - Test if that works
   - If it works, your original URL was the problem

## Example Working Image URLs

You can test with these (they should work):
```
https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800
https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800
https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800
```

Copy these URLs and paste them in the admin panel to test!


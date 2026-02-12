# Image Upload Feature Guide

## ✅ Image Upload is Now Available!

You can now **upload images directly** OR **use image URLs** - it's your choice!

## How It Works

### Option 1: Upload File
1. Click the **"Upload File"** tab
2. Click to select an image from your computer
3. The image will be uploaded automatically
4. Preview will show immediately

### Option 2: Use URL
1. Click the **"Use URL"** tab
2. Paste an image URL (e.g., `https://example.com/image.jpg`)
3. Preview will show immediately

## Where You Can Upload Images

### 1. **Temple Logo** (Manage Home Page)
- Upload your temple logo
- Recommended size: 200x200px (square)
- Formats: JPG, PNG, GIF, WEBP

### 2. **Banner Images** (Manage Home Page)
- Upload multiple banner images
- Recommended size: 1920x400px (wide banner)
- Formats: JPG, PNG, GIF, WEBP

### 3. **Pooja Images** (Manage Poojas)
- Upload image for each pooja
- Recommended size: 400x300px
- Formats: JPG, PNG, GIF, WEBP

### 4. **Inside Temple Map** (Manage Map)
- Upload a map image showing temple layout
- Any size works
- Formats: JPG, PNG, GIF, WEBP

## File Limits

- **Maximum file size**: 5MB per image
- **Allowed formats**: JPG, JPEG, PNG, GIF, WEBP
- **Storage**: Images are saved in `backend/uploads/` folder

## How to Use

1. **Go to Admin Panel** → Login
2. **Navigate to the page** you want to add images to:
   - Manage Home Page (for logo and banners)
   - Manage Poojas (for pooja images)
   - Manage Map (for inside temple map)
3. **Click on the image field**
4. **Choose your method**:
   - **Upload File**: Click "Upload File" tab → Select image
   - **Use URL**: Click "Use URL" tab → Paste URL
5. **See the preview** - Your image will appear immediately
6. **Save** - Click "Save Changes" button

## Tips

- **Uploaded images** are stored on your server (in `backend/uploads/`)
- **URL images** are loaded from external sources
- You can **switch between methods** anytime
- **Preview shows immediately** so you know it works
- If upload fails, try using URL instead

## Troubleshooting

### Upload Fails?
- Check file size (must be under 5MB)
- Check file format (must be JPG, PNG, GIF, or WEBP)
- Try using URL method instead
- Check backend server is running

### Image Not Showing?
- Make sure you clicked "Save Changes"
- Refresh the page
- Check browser console for errors (F12)
- Try a different image

### URL Not Working?
- Make sure URL starts with `http://` or `https://`
- Test URL in browser first (right-click → Open in new tab)
- Some websites block external image use (CORS)

## Example URLs That Work

You can test with these:
```
https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800
https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800
```

## Storage Location

Uploaded images are saved in:
```
backend/uploads/image-1234567890-123456789.jpg
```

They are accessible at:
```
http://localhost:5000/uploads/image-1234567890-123456789.jpg
```

The system automatically generates unique filenames to prevent conflicts.

---

**Enjoy uploading your images!** 🖼️✨


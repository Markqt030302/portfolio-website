const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(express.static('.')); // Serve static files

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

[uploadsDir, videosDir, thumbnailsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Serve uploads with proper video headers
app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res, path) => {
        if (path.endsWith('.mp4')) {
            res.set('Content-Type', 'video/mp4');
        } else if (path.endsWith('.webm')) {
            res.set('Content-Type', 'video/webm');
        } else if (path.endsWith('.mov')) {
            res.set('Content-Type', 'video/quicktime');
        } else if (path.endsWith('.avi')) {
            res.set('Content-Type', 'video/x-msvideo');
        } else if (path.endsWith('.mkv')) {
            res.set('Content-Type', 'video/x-matroska');
        }
        res.set('Accept-Ranges', 'bytes');
    }
}));

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videosDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|mov|avi|webm|mkv/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'));
        }
    }
});

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        initDatabase();
    }
});

// Create tables
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS portfolio_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            filename TEXT NOT NULL,
            thumbnail TEXT,
            video_url TEXT NOT NULL,
            thumbnail_url TEXT,
            file_size INTEGER,
            duration REAL,
            width INTEGER,
            height INTEGER,
            format TEXT,
            upload_type TEXT DEFAULT 'direct',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('✅ Database tables initialized');
}

// Generate video thumbnail
function generateThumbnail(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: [1],
                filename: path.basename(outputPath),
                folder: path.dirname(outputPath),
                size: '600x400'
            })
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err));
    });
}

// Get video metadata and check codec compatibility
function getVideoMetadata(videoPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) return reject(err);
            
            const videoStream = metadata.streams.find(s => s.codec_type === 'video');
            const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
            
            resolve({
                duration: metadata.format.duration,
                size: metadata.format.size,
                width: videoStream?.width || 0,
                height: videoStream?.height || 0,
                format: metadata.format.format_name,
                videoCodec: videoStream?.codec_name || 'unknown',
                audioCodec: audioStream?.codec_name || 'unknown',
                needsConversion: !isWebCompatible(videoStream?.codec_name, path.extname(videoPath))
            });
        });
    });
}

// Check if video codec is web-compatible
function isWebCompatible(codec, ext) {
    const compatibleCodecs = ['h264', 'vp8', 'vp9', 'av1'];
    const compatibleExts = ['.mp4', '.webm'];
    
    return compatibleCodecs.includes(codec?.toLowerCase()) && compatibleExts.includes(ext?.toLowerCase());
}

// Convert video to web-compatible format
function convertToWebFormat(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        console.log(`Converting video to web format: ${inputPath}`);
        
        ffmpeg(inputPath)
            .outputOptions([
                '-c:v libx264',      // H.264 video codec
                '-preset medium',     // Encoding speed/quality balance
                '-crf 23',           // Quality (lower = better, 18-28 is good range)
                '-c:a aac',          // AAC audio codec
                '-b:a 128k',         // Audio bitrate
                '-movflags +faststart' // Enable streaming
            ])
            .output(outputPath)
            .on('end', () => {
                console.log('Conversion completed');
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('Conversion error:', err);
                reject(err);
            })
            .run();
    });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Upload video
app.post('/api/upload-video', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        console.log('Video uploaded:', req.file.filename);

        const videoPath = req.file.path;
        const videoUrl = `/uploads/videos/${req.file.filename}`;
        
        // Generate thumbnail
        const thumbnailFilename = req.file.filename.replace(path.extname(req.file.filename), '.jpg');
        const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
        const thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;

        try {
            await generateThumbnail(videoPath, thumbnailPath);
            console.log('Thumbnail generated:', thumbnailFilename);
        } catch (err) {
            console.error('Thumbnail generation failed:', err);
        }

        // Get video metadata
        let metadata = {
            duration: 0,
            size: req.file.size,
            width: 0,
            height: 0,
            format: path.extname(req.file.originalname),
            videoCodec: 'unknown',
            needsConversion: false
        };

        try {
            const videoMeta = await getVideoMetadata(videoPath);
            metadata = { ...metadata, ...videoMeta };
            
            // Convert if needed
            if (metadata.needsConversion) {
                console.log(`Video needs conversion. Codec: ${metadata.videoCodec}, Format: ${metadata.format}`);
                
                const convertedFilename = req.file.filename.replace(path.extname(req.file.filename), '_converted.mp4');
                const convertedPath = path.join(videosDir, convertedFilename);
                
                try {
                    await convertToWebFormat(videoPath, convertedPath);
                    
                    // Delete original, use converted
                    fs.unlinkSync(videoPath);
                    
                    // Update paths
                    const newVideoPath = convertedPath;
                    const newVideoUrl = `/uploads/videos/${convertedFilename}`;
                    
                    // Update metadata
                    const convertedMeta = await getVideoMetadata(newVideoPath);
                    metadata = { ...metadata, ...convertedMeta };
                    
                    console.log('Video converted successfully to web-compatible format');
                    
                    // Update for response
                    req.file.filename = convertedFilename;
                    videoUrl = newVideoUrl;
                } catch (convErr) {
                    console.error('Conversion failed, using original:', convErr);
                }
            }
        } catch (err) {
            console.error('Metadata extraction failed:', err);
        }

        // Save to database
        const { title } = req.body;
        
        db.run(`
            INSERT INTO videos (title, filename, thumbnail, video_url, thumbnail_url, file_size, duration, width, height, format, upload_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title || 'Untitled Video',
            req.file.filename,
            thumbnailFilename,
            videoUrl,
            thumbnailUrl,
            metadata.size,
            metadata.duration,
            metadata.width,
            metadata.height,
            metadata.format,
            'direct'
        ], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to save video info' });
            }

            res.json({
                success: true,
                videoId: this.lastID,
                videoUrl: videoUrl,
                thumbnailUrl: thumbnailUrl,
                metadata: metadata
            });
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save portfolio data
app.post('/api/save-portfolio', (req, res) => {
    const { key, value } = req.body;

    if (!key) {
        return res.status(400).json({ error: 'Key is required' });
    }

    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

    db.run(`
        INSERT OR REPLACE INTO portfolio_data (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
    `, [key, valueStr], function(err) {
        if (err) {
            console.error('Save error:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }

        res.json({ success: true, message: 'Data saved successfully' });
    });
});

// Get portfolio data
app.get('/api/get-portfolio/:key?', (req, res) => {
    const { key } = req.params;

    if (key) {
        // Get specific key
        db.get('SELECT value FROM portfolio_data WHERE key = ?', [key], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (!row) {
                return res.json({ data: null });
            }

            try {
                const data = JSON.parse(row.value);
                res.json({ data });
            } catch {
                res.json({ data: row.value });
            }
        });
    } else {
        // Get all data
        db.all('SELECT key, value FROM portfolio_data', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            const data = {};
            rows.forEach(row => {
                try {
                    data[row.key] = JSON.parse(row.value);
                } catch {
                    data[row.key] = row.value;
                }
            });

            res.json({ data });
        });
    }
});

// Get all videos
app.get('/api/videos', (req, res) => {
    db.all('SELECT * FROM videos ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ videos: rows });
    });
});

// Delete video
app.delete('/api/videos/:id', (req, res) => {
    const { id } = req.params;

    // Get video info first
    db.get('SELECT filename, thumbnail FROM videos WHERE id = ?', [id], (err, video) => {
        if (err || !video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Delete files
        const videoPath = path.join(videosDir, video.filename);
        const thumbnailPath = path.join(thumbnailsDir, video.thumbnail);

        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }
        if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
        }

        // Delete from database
        db.run('DELETE FROM videos WHERE id = ?', [id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete video' });
            }
            res.json({ success: true, message: 'Video deleted successfully' });
        });
    });
});

// Save embedded video (YouTube/Vimeo)
app.post('/api/save-embed-video', (req, res) => {
    const { title, videoUrl, thumbnailUrl, uploadType } = req.body;

    if (!title || !videoUrl) {
        return res.status(400).json({ error: 'Title and video URL are required' });
    }

    db.run(`
        INSERT INTO videos (title, filename, video_url, thumbnail_url, upload_type)
        VALUES (?, ?, ?, ?, ?)
    `, [title, '', videoUrl, thumbnailUrl, uploadType || 'embed'], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to save video' });
        }

        res.json({
            success: true,
            videoId: this.lastID
        });
    });
});

// Delete video
app.delete('/api/videos/delete/:filename', (req, res) => {
    const { filename } = req.params;
    
    console.log('Delete request for:', filename);
    
    // Get video info from database
    db.get('SELECT * FROM videos WHERE filename = ?', [filename], (err, video) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!video) {
            console.log('Video not found in database');
            return res.status(404).json({ error: 'Video not found' });
        }
        
        // Delete video file
        const videoPath = path.join(videosDir, video.filename);
        if (fs.existsSync(videoPath)) {
            try {
                fs.unlinkSync(videoPath);
                console.log('Video file deleted:', videoPath);
            } catch (err) {
                console.error('Error deleting video file:', err);
            }
        }
        
        // Delete thumbnail file
        if (video.thumbnail) {
            const thumbnailPath = path.join(thumbnailsDir, video.thumbnail);
            if (fs.existsSync(thumbnailPath)) {
                try {
                    fs.unlinkSync(thumbnailPath);
                    console.log('Thumbnail deleted:', thumbnailPath);
                } catch (err) {
                    console.error('Error deleting thumbnail:', err);
                }
            }
        }
        
        // Delete from database
        db.run('DELETE FROM videos WHERE filename = ?', [filename], (err) => {
            if (err) {
                console.error('Error deleting from database:', err);
                return res.status(500).json({ error: 'Failed to delete from database' });
            }
            
            console.log('Video deleted from database');
            res.json({ 
                success: true, 
                message: 'Video and thumbnail deleted successfully' 
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   🚀 Portfolio Server Running!         ║
    ╠════════════════════════════════════════╣
    ║   📍 URL: http://localhost:${PORT}      ║
    ║   📂 Admin: http://localhost:${PORT}/admin.html ║
    ║   🌐 Site: http://localhost:${PORT}/index.html  ║
    ╚════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

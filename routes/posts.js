import express from 'express';
import prisma from '../prisma/client.js';
import multer from 'multer';
import path from 'path';

// Setup multer untuk simpan file ke folder /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // kasih nama unik, contoh pakai timestamp + ekstensi asli
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// GET semua post
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST buat post baru dengan upload gambar (field name 'image')
router.post('/', upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  let imageUrl = null;

  if (req.file) {
    // URL gambar bisa diakses dari /uploads/namafile
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  try {
    const newPost = await prisma.post.create({
      data: { title, content, imageUrl },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;

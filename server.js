import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import postsRouter from './routes/posts.js';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static folder untuk akses gambar yang diupload
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import express from 'express';
import multer from 'multer';

const app = express();
const upload = multer({
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

app.post('/convert', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo não recebido' });
        }

        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Apenas PDF é permitido' });
        }

        const base64 = req.file.buffer.toString('base64');

        res.json({
            filename: req.file.originalname,
            base64
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/health', (req, res) => {
    res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});

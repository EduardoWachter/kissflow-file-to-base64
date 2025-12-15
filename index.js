import express from 'express';
import multer from 'multer';

const app = express();

/**
 * Multer em memória (necessário para base64)
 */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB
    }
});

/**
 * Endpoint principal
 */
app.post('/convert', upload.single('file'), (req, res) => {
    try {

        // 1️⃣ Verificação básica
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo não recebido' });
        }

        // 2️⃣ Validação REAL de PDF (não confia em mimetype)
        const pdfHeader = req.file.buffer.slice(0, 4).toString();

        if (pdfHeader !== '%PDF') {
            return res.status(400).json({ error: 'Arquivo não é um PDF válido' });
        }

        // 3️⃣ Conversão para Base64
        const base64 = req.file.buffer.toString('base64');

        // 4️⃣ Retorno
        return res.json({
            filename: req.file.originalname || 'documento.pdf',
            base64
        });

    } catch (err) {
        console.error('Erro no /convert:', err);
        return res.status(500).json({ error: 'Erro interno ao converter arquivo' });
    }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.send('OK');
});

/**
 * Start
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});

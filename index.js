import express from 'express';
import multer from 'multer';

const app = express();

// Configuração do Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Middleware de Log
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Requisição recebida em ${req.url}`);
    next();
});

/**
 * ROTA PRINCIPAL: Usando upload.any()
 * Esta mudança corrige o problema do nome de campo estranho do Kissflow.
 */
app.post('/convert', upload.any(), (req, res) => {
    try {
        console.log('--- Processando Upload ---');

        // 1. Verifica se chegou ALGUM arquivo (req.files, no plural)
        if (!req.files || req.files.length === 0) {
            console.log('Nenhum arquivo encontrado em req.files');
            // Log para ver se chegou algum dado no body que possa ser útil
            console.log('Dados no Body:', req.body); 
            return res.status(400).json({ error: 'Nenhum arquivo recebido ou campo nomeado incorretamente.' });
        }

        // 2. Pega o primeiro arquivo que chegou
        const file = req.files[0];
        
        console.log(`Arquivo recebido! Campo nomeado como: ${file.fieldname}`);
        
        // 3. Conversão para Base64
        const base64 = file.buffer.toString('base64');

        // 4. Retorno
        return res.json({
            filename: file.originalname || 'documento.pdf',
            base64: base64,
            type: file.mimetype 
        });

    } catch (err) {
        console.error('Erro fatal na conversão:', err);
        return res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
    }
});

/**
 * Health check e Start
 */
app.get('/health', (req, res) => {
    res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
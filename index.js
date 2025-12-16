import express from 'express';
import multer from 'multer';

// Inicialização
const app = express();

// Configuração do Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

// Middleware de Log
app.use((req, res, next) => {
    // Adicione esta linha para ver se a requisição está chegando
    console.log(`[${new Date().toISOString()}] Requisição recebida em ${req.url} - Método: ${req.method}`);
    next();
});

/**
 * ROTA PRINCIPAL: Usando upload.any()
 */
app.post('/convert', upload.any(), (req, res) => {
    try {
        console.log('--- Rota /convert Acessada ---');
        
        // **IMPORTANTE:** Log para ver o que o Multer encontrou
        console.log('Arquivos encontrados pelo Multer (req.files):', req.files); 
        
        if (!req.files || req.files.length === 0) {
            console.log('Falha: Nenhum arquivo em req.files. Enviando erro 400.');
            return res.status(400).json({ error: 'Nenhum arquivo recebido ou Multer falhou.' });
        }

        const file = req.files[0];
        
        console.log(`Arquivo processado! Nome original: ${file.originalname}`);
        
        // Conversão para Base64
        const base64 = file.buffer.toString('base64');

        // Retorno JSON de Sucesso
        return res.json({
            filename: file.originalname,
            base64: base64,
            type: file.mimetype 
        });

    } catch (err) {
        // Captura qualquer erro de execução na rota e retorna JSON de erro
        console.error('Erro de Processamento na Rota:', err);
        return res.status(500).json({ 
            error: 'Erro interno no servidor (API).', 
            details: err.message 
        });
    }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.send('API OK');
});

// Inicialização do Servidor (deve ser o último bloco)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
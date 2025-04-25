const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: require('playwright').chromium.executablePath(),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('📱 Escaneie o QR code abaixo para logar no WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Cliente pronto!');
});

client.initialize();

// Rota para pegar foto de perfil
app.get('/foto/:numero', async (req, res) => {
    const numero = req.params.numero;
    const contato = `${numero}@c.us`;

    try {
        const ppUrl = await client.getProfilePicUrl(contato);
        res.json({ foto: ppUrl });
    } catch (err) {
        res.status(404).json({ erro: 'Não foi possível obter a foto.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

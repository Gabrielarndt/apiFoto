const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable', // caminho do navegador no Render
    args: ['--no-sandbox'],
    headless: true
  }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📲 Escaneie o QR code!');
});

client.on('ready', () => {
  console.log('✅ Conectado ao WhatsApp!');
});

client.initialize();

app.get('/foto', async (req, res) => {
  const numero = req.query.numero;
  if (!numero) return res.status(400).json({ error: 'Número não informado' });

  try {
    const contato = await client.getContactById(`${numero}@c.us`);
    const foto = await contato.getProfilePicUrl();
    res.json({ numero, foto });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar foto', detalhe: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

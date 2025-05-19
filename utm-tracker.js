const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'utm-tracker-data.json');

// Инициализация файла для хранения статистики
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    console.log('UTM data file created.');
}

// Middleware для логирования переходов
app.get('/', (req, res) => {
    const utm = req.query.src || 'direct';

    // Чтение текущих данных
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Обновление статистики
    if (!data[utm]) data[utm] = 0;
    data[utm]++;

    // Сохранение данных
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    res.send(`<h1>Welcome!</h1><p>Your source: ${utm}</p>`);
});

// Страница статистики
app.get('/stats', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    let statsHtml = '<h1>UTM Stats</h1><ul>';
    for (const [utm, count] of Object.entries(data)) {
        statsHtml += `<li>${utm}: ${count} clicks</li>`;
    }
    statsHtml += '</ul>';
    res.send(statsHtml);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
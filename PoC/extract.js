const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
fs.writeFileSync('views.txt', html.replace(/<script>[\s\S]*?<\/script>/g, '').replace(/<style>[\s\S]*?<\/style>/g, ''));

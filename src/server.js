import { join } from 'path'; // Add missing import

import { static as expressStatic } from 'express';
const app = express();
import { join } from 'path';

app.use(expressStatic(join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
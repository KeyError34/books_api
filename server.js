import express from 'express';
import sequelize from './config/db.js';
import 'dotenv/config';
import cors from 'cors';
import Book from './models/book.js'
const app = express();
const port = process.env.PORT || 3334;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Welcome to Book API!'));

app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/books', async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const book = await Book.create({ title, author, year });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year } = req.body;

    const [updated] = await Book.update(
      { title, author, year },
      { where: { id } }
    );

    if (!updated) return res.status(404).json({ error: 'Book not found' });

    const updatedBook = await Book.findByPk(id);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Book.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ error: 'Book not found' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log(
      'Connection to the database has been established successfully.'
    );
     console.log(`Server is working at http://127.0.0.1:${port}`);
  } catch (error) {
    console.log('Unable to connect to the database.', error);
  }
});

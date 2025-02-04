const express = require('express');

const app = express();
app.use(express.json()); 

// In-memory user storage (for testing purposes)
const users = [];

/*
{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "secure123"
}
*/
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = { id: users.length + 1, name, email, password };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
});


// {
//     "email": "alice@example.com",
//     "password": "secure123"
// }

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/search', (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
});

/*
{
    "name": "Alice Updated"
}
*/
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const user = users.find(u => u.id === parseInt(id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;

    res.status(200).json({ message: 'Profile updated successfully', user });
});


app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users.splice(index, 1);

    res.status(200).json({ message: 'User deleted successfully' });
});

// Start the server on port 5000
app.listen(5000, () => console.log('Server running on port 5000'));

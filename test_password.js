const bcrypt = require('bcryptjs');

// Hash que vimos no banco de dados
const hashFromDB = '$2b$12$7hRF7wSVVUML8BgoqO9tJuGs2qoT7LbZsYCRQ6vcFwHY/.XSGnzbi';
const password = 'admin123';

console.log('Testing password:', password);
console.log('Against hash:', hashFromDB);

bcrypt.compare(password, hashFromDB, (err, result) => {
  if (err) {
    console.error('Error comparing password:', err);
  } else {
    console.log('Password match result:', result);
  }
});

// Também vamos testar gerando um novo hash
bcrypt.hash(password, 12, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('New hash for comparison:', hash);
  }
});
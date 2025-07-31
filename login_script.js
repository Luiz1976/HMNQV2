
// Script para fazer login automaticamente
const email = document.querySelector('input[type="email"]');
const password = document.querySelector('input[type="password"]');
const submitButton = document.querySelector('button[type="submit"]');

if (email) email.value = 'admin@humaniq.ai';
if (password) password.value = 'admin123';
if (submitButton) submitButton.click();


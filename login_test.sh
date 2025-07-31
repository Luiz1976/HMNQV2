
// Vou usar curl para fazer login via API e depois redirecionar
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'email=admin@humaniq.ai&password=admin123&csrfToken=' \
  -c cookies.txt -L -v


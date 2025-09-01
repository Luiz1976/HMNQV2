#!/usr/bin/env node

/**
 * Script para verificar a configuração da análise grafológica com IA
 * Este script verifica se as variáveis de ambiente estão configuradas corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração da análise grafológica com IA...\n');

// Verificar arquivo .env
const envPath = path.join(__dirname, '.env');
let envConfig = {};

if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env encontrado');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Parse variáveis de ambiente
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envConfig[key.trim()] = value.trim();
    }
  });
} else {
  console.log('⚠️ Arquivo .env não encontrado');
  console.log('   Copie .env.example para .env e configure as variáveis');
}

// Verificar chaves de API
console.log('\n📊 Configuração das APIs:');

if (envConfig.GEMINI_API_KEY && envConfig.GEMINI_API_KEY !== 'your_google_gemini_api_key_here') {
  console.log('✅ GEMINI_API_KEY configurada');
  console.log(`   Chave: ${envConfig.GEMINI_API_KEY.substring(0, 10)}...`);
} else {
  console.log('❌ GEMINI_API_KEY não configurada ou usando valor padrão');
  console.log('   A análise usará simulação ao invés de IA real');
}

if (envConfig.ABACUSAI_API_KEY && envConfig.ABACUSAI_API_KEY !== 'your_abacusai_api_key_here') {
  console.log('✅ ABACUSAI_API_KEY configurada');
  console.log(`   Chave: ${envConfig.ABACUSAI_API_KEY.substring(0, 10)}...`);
} else {
  console.log('⚠️ ABACUSAI_API_KEY não configurada (opcional)');
}

if (envConfig.NEXT_PUBLIC_APP_URL) {
  console.log('✅ NEXT_PUBLIC_APP_URL configurada:', envConfig.NEXT_PUBLIC_APP_URL);
} else {
  console.log('⚠️ NEXT_PUBLIC_APP_URL não configurada, usando padrão');
}

// Verificar arquivos de análise
console.log('\n📁 Verificando arquivos do sistema:');

const requiredFiles = [
  'app/api/ai/graphology-analysis/route.ts',
  'app/api/ai/analyze/route.ts',
  'lib/ai/graphology-training.ts'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} não encontrado`);
  }
});

// Resumo
console.log('\n🎯 Resumo da configuração:');
if (envConfig.GEMINI_API_KEY && envConfig.GEMINI_API_KEY !== 'your_google_gemini_api_key_here') {
  console.log('🚀 Análise grafológica com IA REAL está ATIVADA');
  console.log('   ✅ Usará Google Gemini API para análises');
  console.log('   ✅ Análises serão baseadas em princípios científicos');
  console.log('   ✅ Scores personalizados para cada usuário');
} else {
  console.log('⚠️ Análise grafológica com IA REAL está DESATIVADA');
  console.log('   ❌ Usará simulação (valores padrão)');
  console.log('   ❌ Para ativar, configure GEMINI_API_KEY no arquivo .env');
}

console.log('\n📋 Próximos passos:');
if (!envConfig.GEMINI_API_KEY || envConfig.GEMINI_API_KEY === 'your_google_gemini_api_key_here') {
  console.log('1. Obtenha uma chave de API do Google Gemini');
  console.log('2. Configure no arquivo .env: GEMINI_API_KEY=sua_chave_aqui');
  console.log('3. Reinicie o servidor: npm run dev');
}

console.log('\n✅ Verificação concluída!');
import crypto from 'crypto';

// Configurações de criptografia AES-256-GCM
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

/**
 * Gera uma chave de criptografia segura
 * @returns Buffer com a chave de 256 bits
 */
export function generateEncryptionKey(): Buffer {
  return crypto.randomBytes(KEY_LENGTH);
}

/**
 * Obtém a chave de criptografia do ambiente ou gera uma nova
 * @returns Buffer com a chave de criptografia
 */
function getEncryptionKey(): Buffer {
  const envKey = process.env.HUMANIQ_ENCRYPTION_KEY;
  
  if (envKey) {
    return Buffer.from(envKey, 'hex');
  }
  
  // Em desenvolvimento, gera uma chave temporária
  console.warn('⚠️  HUMANIQ_ENCRYPTION_KEY não encontrada. Gerando chave temporária.');
  return generateEncryptionKey();
}

/**
 * Interface para dados criptografados
 */
export interface EncryptedData {
  encryptedData: string;
  iv: string;
  tag: string;
}

/**
 * Criptografa dados usando AES-256-GCM
 * @param data - Dados para criptografar (string ou objeto)
 * @returns Objeto com dados criptografados, IV e tag de autenticação
 */
export function encrypt(data: string | object): EncryptedData {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Converte dados para string se necessário
    const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Cria o cipher
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from('humaniq-lgpd', 'utf8')); // Additional Authenticated Data
    
    // Criptografa os dados
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Obtém a tag de autenticação
    const tag = cipher.getAuthTag();
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  } catch (error) {
    console.error('❌ Erro na criptografia:', error);
    throw new Error('Falha na criptografia dos dados');
  }
}

/**
 * Descriptografa dados usando AES-256-GCM
 * @param encryptedData - Objeto com dados criptografados
 * @returns Dados descriptografados como string
 */
export function decrypt(encryptedData: EncryptedData): string {
  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');
    
    // Cria o decipher
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAAD(Buffer.from('humaniq-lgpd', 'utf8'));
    decipher.setAuthTag(tag);
    
    // Descriptografa os dados
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('❌ Erro na descriptografia:', error);
    throw new Error('Falha na descriptografia dos dados');
  }
}

/**
 * Descriptografa e converte para objeto JSON
 * @param encryptedData - Dados criptografados
 * @returns Objeto JSON descriptografado
 */
export function decryptToObject<T = any>(encryptedData: EncryptedData): T {
  try {
    const decryptedString = decrypt(encryptedData);
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error('❌ Erro ao converter dados descriptografados para objeto:', error);
    throw new Error('Falha na conversão dos dados descriptografados');
  }
}

/**
 * Criptografa dados para armazenamento no banco
 * @param data - Dados para criptografar
 * @returns String JSON com dados criptografados
 */
export function encryptForDatabase(data: string | object): string {
  const encrypted = encrypt(data);
  return JSON.stringify(encrypted);
}

/**
 * Descriptografa dados do banco de dados
 * @param encryptedString - String JSON com dados criptografados
 * @returns Dados descriptografados
 */
export function decryptFromDatabase(encryptedString: string): string {
  try {
    const encryptedData: EncryptedData = JSON.parse(encryptedString);
    return decrypt(encryptedData);
  } catch (error) {
    console.error('❌ Erro ao descriptografar dados do banco:', error);
    throw new Error('Falha na descriptografia dos dados do banco');
  }
}

/**
 * Descriptografa dados do banco e converte para objeto
 * @param encryptedString - String JSON com dados criptografados
 * @returns Objeto descriptografado
 */
export function decryptFromDatabaseToObject<T = any>(encryptedString: string): T {
  try {
    const decryptedString = decryptFromDatabase(encryptedString);
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error('❌ Erro ao converter dados do banco para objeto:', error);
    throw new Error('Falha na conversão dos dados do banco');
  }
}

/**
 * Gera hash seguro para verificação de integridade
 * @param data - Dados para gerar hash
 * @returns Hash SHA-256 em hexadecimal
 */
export function generateHash(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Verifica se os dados correspondem ao hash
 * @param data - Dados originais
 * @param hash - Hash para comparação
 * @returns True se os dados correspondem ao hash
 */
export function verifyHash(data: string, hash: string): boolean {
  const dataHash = generateHash(data);
  return crypto.timingSafeEqual(Buffer.from(dataHash, 'hex'), Buffer.from(hash, 'hex'));
}

/**
 * Mascara dados sensíveis para logs de auditoria
 * @param data - Dados para mascarar
 * @param visibleChars - Número de caracteres visíveis no início e fim
 * @returns Dados mascarados
 */
export function maskSensitiveData(data: string, visibleChars: number = 3): string {
  if (!data || data.length <= visibleChars * 2) {
    return '*'.repeat(data?.length || 8);
  }
  
  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const middle = '*'.repeat(Math.max(4, data.length - (visibleChars * 2)));
  
  return `${start}${middle}${end}`;
}

/**
 * Valida se uma string é um JSON de dados criptografados válido
 * @param encryptedString - String para validar
 * @returns True se é um formato válido
 */
export function isValidEncryptedFormat(encryptedString: string): boolean {
  try {
    const parsed = JSON.parse(encryptedString);
    return (
      typeof parsed === 'object' &&
      typeof parsed.encryptedData === 'string' &&
      typeof parsed.iv === 'string' &&
      typeof parsed.tag === 'string'
    );
  } catch {
    return false;
  }
}

// Exporta constantes para uso externo
export const CRYPTO_CONSTANTS = {
  ALGORITHM,
  KEY_LENGTH,
  IV_LENGTH,
  TAG_LENGTH
} as const;
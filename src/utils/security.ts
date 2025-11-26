// Utilidades de seguridad

// Sanitizar entrada de usuario
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim();
};

// Validar email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validar teléfono
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Validar dirección de wallet
export const validateWalletAddress = (address: string, type: 'btc' | 'eth' | 'sol'): boolean => {
  const patterns = {
    btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
    eth: /^0x[a-fA-F0-9]{40}$/,
    sol: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  };
  
  return patterns[type]?.test(address) || false;
};

// Rate limiting simple
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Filtrar intentos dentro de la ventana de tiempo
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Generar token CSRF
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Validar token CSRF
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length >= 20;
};

// Escapar HTML
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Validar URL
export const validateURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Detectar contenido malicioso
export const detectMaliciousContent = (content: string): boolean => {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(content));
};

// Logging seguro (sin datos sensibles)
export const secureLog = (message: string, data?: any) => {
  const sanitizedData = data ? {
    ...data,
    password: data.password ? '[REDACTED]' : undefined,
    token: data.token ? '[REDACTED]' : undefined,
    apiKey: data.apiKey ? '[REDACTED]' : undefined,
    privateKey: data.privateKey ? '[REDACTED]' : undefined
  } : undefined;
  
  console.log(`[SECURE LOG] ${message}`, sanitizedData);
};
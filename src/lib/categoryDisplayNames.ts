/**
 * Mapeamento de nomes de categorias para exibição na interface
 * IMPORTANTE: Os nomes das chaves devem corresponder exatamente aos valores 
 * armazenados na coluna 'category' da tabela 'trinks_services'
 */
export const CATEGORY_DISPLAY_NAMES = {
  "Tratamentos para Cabelo": "Cabelo",
  "Manicure e Pedicure": "Manicure e Pedicure",
  "Serviços de estética facial.": "Estética"
} as const;

/**
 * Mapeamento de labels específicos para componentes
 */
export const SERVICE_TYPE_DISPLAY_NAMES = {
  "Outros serviços": "Tratamentos",
  "Outros Serviços": "Tratamentos"
} as const;

/**
 * Retorna o nome de exibição para uma categoria
 * @param category - Nome da categoria conforme armazenado no banco de dados
 * @returns Nome formatado para exibição na interface
 */
export function getCategoryDisplayName(category: string): string {
  return CATEGORY_DISPLAY_NAMES[category as keyof typeof CATEGORY_DISPLAY_NAMES] || category;
}

/**
 * Retorna o nome de exibição para tipos de serviço
 * @param serviceType - Tipo de serviço original
 * @returns Nome formatado para exibição na interface
 */
export function getServiceTypeDisplayName(serviceType: string): string {
  return SERVICE_TYPE_DISPLAY_NAMES[serviceType as keyof typeof SERVICE_TYPE_DISPLAY_NAMES] || serviceType;
}

/**
 * Constantes para consistência na aplicação
 */
export const CATEGORIES = {
  HAIR_TREATMENTS: "Tratamentos para Cabelo", // Valor do banco de dados
  MANICURE_PEDICURE: "Manicure e Pedicure",   // Valor do banco de dados
  ESTETICA: "Serviços de estética facial."    // Valor do banco de dados
} as const;

/**
 * Constantes para nomes de exibição
 */
export const DISPLAY_CATEGORIES = {
  HAIR: "Cabelo",                             // Nome de exibição
  MANICURE_PEDICURE: "Manicure e Pedicure",  // Nome de exibição
  ESTETICA: "Estética"                        // Nome de exibição
} as const;

/**
 * Categorias habilitadas no dashboard
 * Para desabilitar uma categoria, defina como false
 */
export const ENABLED_CATEGORIES = {
  [CATEGORIES.HAIR_TREATMENTS]: true,
  [CATEGORIES.MANICURE_PEDICURE]: true,
  [CATEGORIES.ESTETICA]: false,  // Estética desabilitada
} as const;

/**
 * Verifica se uma categoria está habilitada
 * @param category - Nome da categoria conforme armazenado no banco de dados
 * @returns true se a categoria está habilitada, false caso contrário
 */
export function isCategoryEnabled(category: string): boolean {
  return ENABLED_CATEGORIES[category as keyof typeof ENABLED_CATEGORIES] ?? true;
}
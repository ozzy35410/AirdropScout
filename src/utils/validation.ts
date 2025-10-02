// Ethereum address validation
export function isValidEthAddress(address: string): boolean {
  if (!address) return false;
  
  // Check if it's a valid hex string with 0x prefix and 40 characters
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}

// Network validation
export function isValidNetwork(network: string): boolean {
  const validNetworks = ['linea', 'zksync', 'base', 'scroll', 'zora'];
  return validNetworks.includes(network.toLowerCase());
}

// Token standard validation
export function isValidTokenStandard(standard: string): boolean {
  return ['ERC-721', 'ERC-1155'].includes(standard);
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Form validation helpers
export function validateNFTForm(data: {
  title: string;
  network: string;
  contract_address: string;
  token_id: string;
  token_standard: string;
  external_link?: string;
}) {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!data.network) {
    errors.network = 'Network is required';
  } else if (!isValidNetwork(data.network)) {
    errors.network = 'Invalid network selected';
  }

  if (!data.contract_address.trim()) {
    errors.contract_address = 'Contract address is required';
  } else if (!isValidEthAddress(data.contract_address)) {
    errors.contract_address = 'Invalid Ethereum address format';
  }

  if (!data.token_id.trim()) {
    errors.token_id = 'Token ID is required';
  } else if (!/^\d+$/.test(data.token_id)) {
    errors.token_id = 'Token ID must be a number';
  }

  if (!data.token_standard) {
    errors.token_standard = 'Token standard is required';
  } else if (!isValidTokenStandard(data.token_standard)) {
    errors.token_standard = 'Invalid token standard';
  }

  if (data.external_link && !isValidUrl(data.external_link)) {
    errors.external_link = 'Invalid URL format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
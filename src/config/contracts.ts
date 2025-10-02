export const ALLOWLISTED_CONTRACTS = {
  pharos: {
    routers: [
      '0xZenithRouter',
      '0xFarosRouter'
    ],
    nameService: ['0xPharosNameService'],
    lending: ['0xOpenFiCore'],
    trading: ['0xBrokexCore', '0xBitverseCore'],
    rwafi: ['0xAquafluxCore'],
    nft: []
  },
  giwa: {
    routers: [],
    nameService: [],
    lending: [],
    trading: [],
    rwafi: [],
    nft: []
  },
  base: {
    routers: [],
    nameService: [],
    lending: [],
    trading: [],
    rwafi: [],
    nft: ['0xNFT2SME1', '0xNFT2SME2', '0xNFT2SME3']
  },
  sei: {
    routers: [],
    nameService: [],
    lending: [],
    trading: [],
    rwafi: [],
    nft: ['0xNFT2SME1', '0xNFT2SME2']
  }
};

export function isContractAllowed(network: string, address: string): boolean {
  const networkContracts = ALLOWLISTED_CONTRACTS[network as keyof typeof ALLOWLISTED_CONTRACTS];
  if (!networkContracts) return false;

  const allAddresses = [
    ...networkContracts.routers,
    ...networkContracts.nameService,
    ...networkContracts.lending,
    ...networkContracts.trading,
    ...networkContracts.rwafi,
    ...networkContracts.nft
  ];

  return allAddresses.some(addr => addr.toLowerCase() === address.toLowerCase());
}

export const PHAROS_SEND_TARGET = '0x5583BA39732db8006938A83BF64BBB029A0b12A0';

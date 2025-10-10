# Project Brief: AirdropScout

## Overview
AirdropScout is a multi-chain Web3 platform that helps users discover and complete on-chain tasks to qualify for potential airdrops. The platform supports both mainnet and testnet networks, providing a centralized hub for NFT minting, token swaps, faucets, and other blockchain activities.

## Core Objectives
1. **Multi-Network Support**: Provide seamless access to multiple blockchain networks (Base, Sei, Zora, Ink, Soneium, Mode, Optimism, Pharos, GIWA)
2. **Task Tracking**: Enable users to track their on-chain activities across networks
3. **NFT Discovery**: Curated NFT collections with mint statistics and filtering
4. **Safety First**: Gas-only transactions, no token approvals required
5. **Accessibility**: Bilingual support (English/Turkish)

## Key Features
- **Multi-Network Architecture**: Mainnet (Base, Sei, Zora, Ink, Soneium, Mode, OP) and Testnet (Pharos, GIWA)
- **NFT Marketplace**: Browse, filter, and mint NFTs with real-time mint statistics
- **Task System**: Organized tasks by network with progress tracking
- **Faucet Integration**: Direct links to testnet faucets
- **Wallet Integration**: MetaMask and other Web3 wallet support
- **Dynamic Pricing**: Multi-currency support (ETH, PHRS, SEI, GIWA)
- **Admin Panel**: Manage NFT collections via Supabase

## Technology Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Blockchain**: viem, ethers.js
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Bolt.host (auto-deploy from GitHub)
- **i18n**: Custom translation system (EN/TR)

## Target Users
- Crypto enthusiasts seeking airdrop opportunities
- NFT collectors exploring multiple chains
- Testnet users needing faucets and test activities
- Turkish and English speaking Web3 community

## Success Metrics
- Number of supported networks
- NFT collection count per network
- User task completion rates
- Multi-language coverage
- Mint statistics accuracy

## Current Status
- **Networks**: 9 total (7 mainnet, 2 testnet)
- **Latest Addition**: Optimism (OP) mainnet support
- **NFT Collections**: Dynamic via Supabase
- **Languages**: Full EN/TR support
- **Deployment**: Automated via Bolt.host

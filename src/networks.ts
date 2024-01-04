import {assertNotNull} from '@subsquid/util-internal'

import {NetworksConfig} from './interfaces'
import {allFields} from './allFields'

const startingBlock = 18936000
const blocksPerTest = 1000
const blocksPerGap = 100

const networksConfig: NetworksConfig = {
/*	arbitrum: {
		v2alias: 'arbitrum',
		rpc: 'arbitrum-one:http',
		finalityConfirmations: 300,
		tests: [
			{
				id: 'transactions-to',
				transaction: [{
					to: ['0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'], // USDT
					range: { from: 100_000_000, to: 100_001_000 }
				}],
				fields: allFields
			},
			{
				id: 'logs-address',
				log: [{
					address: ['0xaf88d065e77c8cC2239327C5EDb3A432268e5831'], // USDC
					range: {from: 50_000_000, to: 50_001_000}
				}],
				fields: allFields
			}
		]
	},
	optimism: {
		v2alias: 'optimism-mainnet',
		rpc: 'optimism:http',
		finalityConfirmations: 15,
		tests: [
			{
				id: 'transactions-to',
				transaction: [{
					to: ['0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'], // USDT
					range: { from: 50_000_000, to: 50_001_000 }
				}],
				fields: allFields
			},
			{
				id: 'logs-address',
				log: [{
					address: ['0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'], // USDC
					range: {from: 100_000_000, to: 100_001_000}
				}],
				fields: allFields
			},
			{
				id: 'trace-call-to',
				trace: [{
					type: ['call'],
					callTo: ['0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'], // Uniswap v3 router
					transaction: true,
					range: {from: 90_000_000, to: 90_001_000}
				}],
				fields: allFields
			},
			{
				id: 'statediff-address',
				stateDiff: [{
					address: ['0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'], // USDT
					transaction: true,
					range: { from: 60_000_000, to: 60_001_000 }
				}],
				fields: allFields
			}
		]
	},
	polygon: {
		v2alias: 'polygon',
		rpc: 'polygon:http',
		finalityConfirmations: 400,
		tests: [
			{
				id: 'transactions-to',
				transaction: [{
					to: ['0xc2132D05D31c914a87C6611C10748AEb04B58e8F'], // USDT
					range: { from: 40_000_000, to: 40_001_000 }
				}],
				fields: allFields
			},
			{
				id: 'logs-address',
				log: [{
					address: ['0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'], // USDC
					range: {from: 30_000_000, to: 30_001_000}
				}],
				fields: allFields
			},
		]
	},
	binance: {
		v2alias: 'binance',
		rpc: 'bsc:http',
		finalityConfirmations: 5,
		tests: [
			{
				id: 'transactions-to',
				transaction: [{
					to: ['0x55d398326f99059ff775485246999027b3197955'], // BUSD-T
					range: { from: 32_000_000, to: 32_001_000 }
				}],
				fields: allFields
			},
			{
				id: 'logs-address',
				log: [{
					address: ['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'], // USDC
					range: {from: 10_000_000, to: 10_001_000}
				}],
				fields: allFields
			},
			{
				id: 'trace-call-to',
				trace: [{
					type: ['call'],
					callTo: ['0x1b81D678ffb9C0263b24A97847620C99d213eB14'], // PancakeSwap v3 router
					transaction: true,
					range: {from: 30_000_000, to: 30_001_000}
				}],
				fields: allFields
			},
			{
				id: 'statediff-address',
				stateDiff: [{
					address: ['0x55d398326f99059ff775485246999027b3197955'], // BUSD-T
					transaction: true,
					range: { from: 10_000_000, to: 10_001_000 }
				}],
				fields: allFields
			}
		]
	},*/
	ethereum: {
		v2alias: 'eth-mainnet',
		rpc: assertNotNull(process.env.ETH_WSS_ENDPOINT),
		finalityConfirmations: 75,
		tests: [
			{
				id: 'transactions-to',
				transaction: [{
					to: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'], // USDT
					range: {
						from: startingBlock,
						to: startingBlock+blocksPerTest
					}
				}],
				fields: allFields
			},
			{
				id: 'logs-address',
				log: [{
					address: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC
					range: {
						from: startingBlock+blocksPerTest+blocksPerGap,
						to: startingBlock+blocksPerTest*2+blocksPerGap
					}
				}],
				fields: allFields
			},
			{
				id: 'trace-call-to',
				trace: [{
					type: ['call'],
					callTo: ['0xE592427A0AEce92De3Edee1F18E0157C05861564'], // Uniswap v3 router
					transaction: true,
					range: {
						from: startingBlock+blocksPerTest*2+blocksPerGap*2,
						to: startingBlock+blocksPerTest*3+blocksPerGap*2
					}
				}],
				fields: allFields
			},
			{
				id: 'statediff-address',
				stateDiff: [{
					address: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'], // USDT
					transaction: true,
					range: {
						from: startingBlock+blocksPerTest*3+blocksPerGap*3,
						to: startingBlock+blocksPerTest*4+blocksPerGap*3
					}
				}],
				fields: allFields
			}
		]
	}
}

export default networksConfig;

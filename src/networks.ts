import {NetworksConfig} from './interfaces'
import {allFields} from './allFields'

const networksConfig: NetworksConfig = {
	arbitrum: {
		v2alias: 'arbitrum',
		rpc: 'arbitrum-one:http',
		finalityConfirmations: 300,
		tests: []
	},
	optimism: {
		v2alias: 'optimism-mainnet',
		rpc: 'optimism:http',
		finalityConfirmations: 15,
		tests: []
	},
	polygon: {
		v2alias: 'polygon',
		rpc: 'polygon:http',
		finalityConfirmations: 400,
		tests: []
	},
	binance: {
		v2alias: 'binance',
		rpc: 'bsc:http',
		finalityConfirmations: 5,
		tests: [
/*			{
				id: 'transactions-to',
				transaction: [{
					to: ['0x55d398326f99059ff775485246999027b3197955'], // BUSD-T
					range: { from: 32_000_000, to: 32_010_000 }
				}],
				fields: allFields
			},*/
		]
	},
	ethereum: {
		v2alias: 'eth-mainnet',
//		rpc: 'eth:http',
		rpc: 'https://rpc.ankr.com/eth',
		finalityConfirmations: 75,
		tests: [
			{
				id: 'transactions-to',
				transaction: [{
					to: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'], // USDT
					range: { from: 10_000_000, to: 10_010_000 }
				}],
				fields: allFields
			},
/*			{
				id: 'logs-address',
				log: [{
					address: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC
					range: {from: 10_000_000, to: 10_010_000}
				}],
				fields: allFields
			},
			{
				id: 'trace-call-to',
				trace: [{
					type: ['call'],
					callTo: ['0xE592427A0AEce92De3Edee1F18E0157C05861564'], // Uniswap v3 router
					transaction: true,
					range: {from: 15_000_000, to: 15_010_000}
				}],
				fields: allFields
			},
			{
				id: 'statediff-address',
				stateDiff: [{
					address: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'], // USDT
					transaction: true,
					range: { from: 10_000_000, to: 10_010_000 }
				}],
				fields: allFields
			}*/
		]
	}
}

export default networksConfig;

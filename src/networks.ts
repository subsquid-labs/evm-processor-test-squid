import {
	allTransactionFields,
	allLogFields,
	allTraceFields,
	allStateDiffFields,
	allBlockHeaderFields
} from './allFields'

export default {
	arbitrum: {
		v2alias: 'arbitrum',
		rpc: 'arbitrum-one:http',
	},
	optimism: {
		v2alias: 'optimism-mainnet',
		rpc: 'optimism:http',
	},
	polygon: {
		v2alias: 'polygon',
		rpc: 'polygon:http',
	},
	binance: {
		v2alias: 'binance',
		rpc: 'bsc:http',
	},
	ethereum: {
		v2alias: 'eth-mainnet',
		rpc: 'eth:http',
		tests: [
			{
				id: 'transactions-to',
				transactions: {
					request: {
						to: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'], // USDT
						range: { from: 10_000_000, to: 10_010_000 }
					},
					fields: allTransactionFields
				}
			},
			{
				id: 'logs-address',
				logs: {
					request: {
						address: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC
						range: {from: 10_000_000, to: 10_010_000}
					},
					fields: allLogFields
				}
			},
			{
				id: 'trace-call-to',
				traces: {
					request: {
						type: ['call'],
						callTo: ['0xE592427A0AEce92De3Edee1F18E0157C05861564'], // Uniswap v3 router
						transaction: true,
						range: {from: 15_000_000, to: 15_010_000}
					},
					fields: allTraceFields
				}
			},
			{
				id: 'statediff-address',
				stateDiff: {
					request: {
						address: ['0xdAC17F958D2ee523a2206206994597C13D831ec7'], // USDT
						transaction: true,
						range: { from: 10_000_000, to: 10_010_000 }
					},
					fields: allStateDiffFields
				}
			}
		]
	}
}

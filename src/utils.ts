import {assertNotNull} from '@subsquid/evm-processor'

export function rpcProxyAliasToVariableName(alias: string): string {
	return 'RPC_' + alias.replace(':', '_').replace('-', '_').toUpperCase()
}

export function rpcDescriptionToUrl(desc: string): string {
	if (desc.includes(':')) {
		if (desc.includes('://')) { // we're likely dealing with a raw URL
			return desc
		}
		else {
			return assertNotNull(process.env[rpcProxyAliasToVariableName(desc)])
		}
	}
	throw new Error(`Unrecognized RPC definition`)
}

export function makeTraceId(trace: {transactionIndex: number, traceAddress: number[]}): string {
	return `${trace.transactionIndex}-${trace.traceAddress.join('-')}`
}
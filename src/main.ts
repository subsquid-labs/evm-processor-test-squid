// Executes an individual test config by network name, test index and data source name ('rpc' | 'network')

import {TypeormDatabase} from '@subsquid/typeorm-store'
import {createLogger} from '@subsquid/logger'
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {Transaction, Log, Trace, StateDiff, Block} from './model'
import {assertNotNull} from '@subsquid/util-internal'

import {TestConditions} from './interfaces'
import networks from './networks'
import {rpcDescriptionToUrl, makeTraceId} from './utils'


const network = assertNotNull(process.argv[2])
const testIndex = parseInt(assertNotNull(process.argv[3]))
// @ts-expect-error
const dataSource: 'rpc' | 'network' = assertNotNull( ['rpc', 'network'].includes(process.argv[4]) ? process.argv[4] : undefined )

const networkParams = networks[network]
const test = networkParams.tests[testIndex]
const conditionsPostfix = `${network}_${test.id}_${dataSource}`
const proc = dataSource==='rpc' ? createProcessorWithRpc(network, networkParams.rpc) : createProcessorWithNetwork(networkParams.v2alias)
configureProcessor(proc, test)
runProcessor(proc, network, test.id, dataSource)


function createProcessorWithNetwork(v2alias: string) {
	return new EvmBatchProcessor()
		.setGateway(lookupArchive(v2alias as any))
		.includeAllBlocks()
}

function createProcessorWithRpc(netName: string, rpc: string) {
	const fc = networks[netName].finalityConfirmations
	return new EvmBatchProcessor()
		.setRpcEndpoint({ url: rpcDescriptionToUrl(rpc), rateLimit: 100 })
		.setFinalityConfirmation(fc)
		.includeAllBlocks()
}

function configureProcessor(processor: EvmBatchProcessor, conditions: TestConditions) {
	if (conditions.transaction) {
		for (let txconfig of conditions.transaction) {
			processor.addTransaction(txconfig)
		}
	}
	if (conditions.log) {
		for (let logconfig of conditions.log) {
			processor.addLog(logconfig)
		}
	}
	if (conditions.trace) {
		for (let traceconfig of conditions.trace) {
			processor.addTrace(traceconfig)
		}
	}
	if (conditions.stateDiff) {
		for (let stdiffconfig of conditions.stateDiff) {
			processor.addStateDiff(stdiffconfig)
		}
	}
	processor.setFields(conditions.fields)
}

function runProcessor(
	processor: EvmBatchProcessor,
	network: string,
	testId: string,
	dataSource: 'network' | 'rpc'
) {
	processor.run(new TypeormDatabase({supportHotBlocks: false, stateSchema: `squid_processor_${conditionsPostfix}`}), async ctx => {
		const transactions: Transaction[] = []
		const logs: Log[] = []
		const traces: Trace[] = []
		const stateDiffs: StateDiff[] = []
		const blocks: Block[] = []
		for (let block of ctx.blocks) {
			blocks.push(new Block({
				...block.header,
				id: `${block.header.id}_${conditionsPostfix}`,
				network,
				dataSource,
				testId,
				timestamp: BigInt(block.header.timestamp)
			}))
			for (let tx of block.transactions) {
				const logIds = tx.logs.map(l => l.logIndex)
				const stDiffTxIds = tx.stateDiffs.map(sd => sd.transactionIndex)
				transactions.push(new Transaction({
					...tx,
					id: `${tx.id}_${conditionsPostfix}`,
					block: block.header.height,
					testId,
					network,
					dataSource,
					logs: logIds,
					stateDiffs: stDiffTxIds
				}))
			}
			for (let log of block.logs) {
				const txId = log.transaction?.transactionIndex
				logs.push(new Log({
					...log,
					id: `${log.id}_${conditionsPostfix}`,
					block: block.header.height,
					testId,
					network,
					dataSource,
					transaction: txId
				}))
			}
			for (let trace of block.traces) {
				const txId = trace.transaction?.transactionIndex
				const id = makeTraceId(block.header.height, trace)
				const parentId = trace.parent && makeTraceId(block.header.height, trace.parent)
				const childrenIds = trace.children.map(c => makeTraceId(block.header.height, c))
				const t = new Trace({
					id: `${id}_${conditionsPostfix}`,
					block: block.header.height,
					testId,
					network,
					dataSource,
					transaction: txId,
					parentId,
					childrenIds,
					transactionIndex: trace.transactionIndex,
					traceAddress: trace.traceAddress,
					type: trace.type
				})

				let jstrace = trace as any
				switch (trace.type) {
					case 'call':
						t.callFrom = jstrace.action?.from
						t.callTo = jstrace.action?.to
						t.callValue = jstrace.action?.value
						t.callGas = jstrace.action?.gas
						t.callSighash = jstrace.action?.sighash
						t.callInput = jstrace.action?.input
						t.callResultGasUsed = jstrace.result?.gasUsed
						t.callResultOutput = jstrace.result?.output
						break
					case 'create':
						t.createFrom = jstrace.action?.from
						t.createValue = jstrace.action?.value
						t.createGas = jstrace.action?.gas
						t.createInit = jstrace.action?.init
						t.createResultGasUsed = jstrace.result?.gasUsed
						t.createResultCode = jstrace.result?.code
						t.createResultAddress = jstrace.result?.address
						break
					case 'reward':
						t.suicideAddress = jstrace.action?.address
						t.suicideRefundAddress = jstrace.action?.refundAddress
						t.suicideBalance = jstrace.action?.balance
						break
					case 'suicide':
						t.rewardAuthor = jstrace.action?.author
						t.rewardValue = jstrace.action?.value
						t.rewardType = jstrace.action?.type
						break
				}
				traces.push(t)
			}
			let stdiffNumInBlock = 0
			for (let stDiff of block.stateDiffs) {
				const id = `${block.header.height}-${stdiffNumInBlock}`
				stdiffNumInBlock += 1
				const txId = stDiff.transaction?.transactionIndex
				stateDiffs.push(new StateDiff({
					...stDiff,
					id: `${id}_${conditionsPostfix}`,
					block: block.header.height,
					testId,
					network,
					dataSource,
					transaction: txId
				}))
			}
		}
		await ctx.store.insert(blocks)
		await ctx.store.insert(transactions)
		await ctx.store.insert(logs)
		await ctx.store.insert(traces)
		await ctx.store.insert(stateDiffs)
	})
}

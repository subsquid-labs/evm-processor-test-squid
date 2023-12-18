import {TypeormDatabase} from '@subsquid/typeorm-store'
import {createLogger} from '@subsquid/logger'
import {EvmBatchProcessor} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {Transaction, Log, Trace, StateDiff, Block} from './model'

import {TestConditions} from './interfaces'
import networks from './networks'
import {rpcDescriptionToUrl, makeTraceId} from './utils'

const testsLog = createLogger('processor-tests')
const db = new TypeormDatabase({supportHotBlocks: false})

for (let [nname, nparams] of Object.entries(networks)) {
	testsLog.info(`Gathering data for tests on network ${nname}...`)
	for (let test of nparams.tests) {
		{
			testsLog.info(`${test.id}/RPC in progress`)
			const rpcProc = createProcessorWithRpc(nparams.v2alias)
			configureProcessor(rpcProc, test)
			runProcessor(rpcProc, nname, test.id, 'rpc')
		}
		{
			testsLog.info(`${test.id}/Network in progress`)
			const nwProc = createProcessorWithNetwork(nparams.v2alias)
			configureProcessor(nwProc, test)
			runProcessor(nwProc, nname, test.id, 'network')
		}
	}
}

function createProcessorWithNetwork(v2alias: string) {
	return new EvmBatchProcessor().setArchive(lookupArchive(v2alias as any))
}

function createProcessorWithRpc(rpc: string) {
	return new EvmBatchProcessor().setRpcEndpoint({ url: rpcDescriptionToUrl(rpc), rateLimit: 10 })
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
	processor.run(db, async ctx => {
		const transactions: Transaction[] = []
		const logs: Log[] = []
		const traces: Trace[] = []
		const stateDiffs: StateDiff[] = []
		const blocks: Block[] = []
		for (let block of ctx.blocks) {
			blocks.push(new Block({ network, dataSource, testId, ...block.header }))
			for (let tx of block.transactions) {
				const logIds = tx.logs.map(l => l.logIndex)
				const stDiffTxIds = tx.stateDiffs.map(sd => sd.transactionIndex)
				transactions.push(new Transaction({
					...tx,
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
					block: block.header.height,
					testId,
					network,
					dataSource,
					transaction: txId
				}))
			}
			for (let trace of block.traces) {
				const txId = trace.transaction?.transactionIndex
				const id = makeTraceId(trace)
				const parentId = trace.parent && makeTraceId(trace.parent)
				const childrenIds = trace.children.map(c => makeTraceId(c))
				const t = new Trace({
					id,
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
					id,
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
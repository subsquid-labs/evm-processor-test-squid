import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Transaction, Log, Trace, StateDiff} from './model'

import networks from './networks'

console.log(JSON.stringify(networks))

/*
processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
		const burns: Burn[] = []
		for (let c of ctx.blocks) {
				for (let tx of c.transactions) {
						// decode and normalize the tx data
						burns.push(
								new Burn({
										id: tx.id,
										block: c.header.height,
										address: tx.from,
										value: tx.value,
										txHash: tx.hash,
								})
						)
				}
		}
		// apply vectorized transformations and aggregations
		const burned = burns.reduce((acc, b) => acc + b.value, 0n) / 1_000_000_000n
		const startBlock = ctx.blocks.at(0)?.header.height
		const endBlock = ctx.blocks.at(-1)?.header.height
		ctx.log.info(`Burned ${burned} Gwei from ${startBlock} to ${endBlock}`)

		// upsert batches of entities with batch-optimized ctx.store.save
		await ctx.store.upsert(burns)
})
*/
/*
import {assertNotNull} from '@subsquid/util-internal'
import {lookupArchive} from '@subsquid/archive-registry'
import {
		BlockHeader,
		DataHandlerContext,
		EvmBatchProcessor,
		EvmBatchProcessorFields,
		Log as _Log,
		Transaction as _Transaction,
} from '@subsquid/evm-processor'

export const processor = new EvmBatchProcessor()
		.setDataSource({
				archive: lookupArchive('eth-mainnet'),
				chain: {
						url: assertNotNull(process.env.RPC_ENDPOINT),
						rateLimit: 10
				}
		})
		.setFinalityConfirmation(75)
		.setFields({
				transaction: {
						from: true,
						value: true,
						hash: true,
				},
		})
		.setBlockRange({
				from: 0,
		})
		.addTransaction({
				to: ['0x0000000000000000000000000000000000000000'],
		})

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
*/

//// !!!! Do not forget to test block headers!

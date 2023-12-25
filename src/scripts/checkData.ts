import { Client, QueryResultRow } from 'pg'
import { runProgram } from '@subsquid/util-internal'
import { toSnakeCase } from '@subsquid/util-naming'
import networks from '../networks'

runProgram(main)

const tableNames = ['transaction', 'log', 'trace', 'state_diff', 'block']
const recordIdentificationFields: Record<string, string[]> = {
	transaction: [ 'block', 'transaction_index', 'hash' ],
	log: [ 'block', 'transaction_index', 'log_index', 'transaction_hash' ],
	trace: [ 'block', 'transaction_index', 'trace_address', 'type' ],
	state_diff: [ 'block', 'transaction_index', 'key' ],
	block: [ 'hash', 'height' ]
}

async function main() {
	const client = new Client({
		user: 'postgres',
		host: 'localhost',
		database: 'squid',
		password: 'postgres',
		port: 23798
  })
	await client.connect()

	const fields = await getAllTablesFields(client, tableNames)

	for (let [nname, nparams] of Object.entries(networks)) {
		console.log(`Checking data for tests on network ${nname}...`)
		for (let [testIndex, test] of nparams.tests.entries()) {
			console.log(`Checking the results of test ${test.id}...`)
			await checkTestResults(client, fields, nname, test.id)
		}
	}

	await client.end()
}

async function getAllTablesFields(client: Client, tables: string[]): Promise<Record<string, string[]>> {
	const entries = await Promise.all(tables.map(async t => { return [t, await getTableFields(client, t)]; }))
	return Object.fromEntries(entries)
}

async function getTableFields(client: Client, table: string): Promise<string[]> {
	const fields = await client.query(`select * from information_schema.columns where table_schema='public' and table_name='${table}'`)
	return fields.rows.map(r => r.column_name)
}

async function checkTestResults(client: Client, fields: Record<string, string[]>, network: string, testId: string): Promise<void> {
	for (let table in fields) {
		function selectQuery(what: string, dataSource: 'rpc' | 'network', order: boolean = true): string {
			const orderField = table==='block' ? 'height' : 'block'
			const orderBy = order ? `order by ${orderField} asc, id asc` : ''
			return `select ${what} from ${table} where network='${network}' and test_id='${testId}' and data_source='${dataSource}' ${orderBy}`
		}
		function comparisonQuery(what: string, from: 'rpc' | 'network'): string {
			const to: 'rpc' | 'network' = from==='rpc' ? 'network' : 'rpc'
			return `select * from (${selectQuery(what, from)}) as rpc_query except select * from (${selectQuery(what, to)}) as network_query`
		}
		async function compare(what: string): Promise<{rpc2network: QueryResultRow[], network2rpc: QueryResultRow[]} | null> {
			const rpc2network = (await client.query(comparisonQuery(what, 'rpc'))).rows
			const network2rpc = (await client.query(comparisonQuery(what, 'network'))).rows
			if (rpc2network.length===0 && network2rpc.length===0)
				return null
			else
				return { rpc2network, network2rpc }
		}
		const comparedFields = fields[table]
			.filter(f => f!=='id' && f!=='data_source' && f!=='network' && f!=='test_id')
			.map(f => {
				// escaping the reserved keyword field names
				if (f==='from')
					return `"from"`
				if (f==='to')
					return `"to"`
				return f
			})

		const fullComparison = await compare(comparedFields.join(', '))
		if (fullComparison!=null) {
			console.log(`Data for table ${table} differs at ${fullComparison.rpc2network.length} rpc2network and ${fullComparison.network2rpc.length} network2rpc rows`)
			const rpcRowsCount = (await client.query(selectQuery('count(*)', 'rpc', false))).rows[0].count
			const networkRowsCount = (await client.query(selectQuery('count(*)', 'network', false))).rows[0].count
			if (rpcRowsCount!==networkRowsCount) {
				console.log(`Row counts are different: ${rpcRowsCount} for RPC and ${networkRowsCount} for the network`)
				const recordIdentificationFieldsComparison = await compare(recordIdentificationFields[table].join(', '))
				if (recordIdentificationFieldsComparison==null)
					console.log(`Row counts are different, but identification rows comparison retured nothing. This should never happen.`)
				else {
					if (recordIdentificationFieldsComparison.rpc2network.length>0) {
						console.log(`Rows present in RPC but not network:`)
						console.table(recordIdentificationFieldsComparison.rpc2network)
					}
					if (recordIdentificationFieldsComparison.network2rpc.length>0) {
						console.log(`Rows present in network but not RPC:`)
						console.table(recordIdentificationFieldsComparison.network2rpc)
					}
				}
			}
			else {
				console.log(`Row counts coincide at ${rpcRowsCount}, comparing record identification fields`)
				const recordIdentificationFieldsComparison = await compare(recordIdentificationFields[table].join(', '))
				if (recordIdentificationFieldsComparison==null) {
					console.log(`Record identification fields coincide, comparing other fields`)
					for (let cf of comparedFields) {
						if (recordIdentificationFields[table].includes(cf))
							continue
						const cfFieldsComparison = await compare(recordIdentificationFields[table].concat([cf]).join(', '))
						if (cfFieldsComparison!==null) {
							console.log(`Field ${cf} differs at ${cfFieldsComparison.rpc2network.length} rpc2network and ${cfFieldsComparison.network2rpc.length} network2rpc rows`)
							console.log(`Sample of ${cfFieldsComparison.rpc2network.length} RPC-only rows:`)
							console.table(cfFieldsComparison.rpc2network.slice(0, 10))
							console.log(`Sample of ${cfFieldsComparison.network2rpc.length} network-only rows:`)
							console.table(cfFieldsComparison.network2rpc.slice(0, 10))
						}
					}
				}
			}
			console.log('\n')
		}
	}
}

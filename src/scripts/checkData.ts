import { Client } from 'pg'
import { runProgram } from '@subsquid/util-internal'
import { toSnakeCase } from '@subsquid/util-naming'
import networks from '../networks'

runProgram(main)

async function main() {
	const client = new Client({
		user: 'postgres',
		host: 'localhost',
		database: 'squid',
		password: 'postgres',
		port: 23798
  })
	await client.connect()

	const fields = await getAllTablesFields(client, ['transaction', 'log', 'trace', 'state_diff', 'block'])

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
		function comparisonQuery(what: string) {
			return `select * from (${selectQuery(what, 'rpc')}) as rpc_query except select * from (${selectQuery(what, 'network')}) as network_query`
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

		const fullComparison = await client.query(comparisonQuery(comparedFields.join(', ')))
		if (fullComparison.rows.length>0) {
			console.log(`data for table ${table} differs at ${fullComparison.rows.length} rows`)
			const rpcRowsCount = (await client.query(selectQuery('count(*)', 'rpc', false))).rows[0].count
			const networkRowsCount = (await client.query(selectQuery('count(*)', 'network', false))).rows[0].count
			if (rpcRowsCount!==networkRowsCount) {
				console.log(`Row counts are different: ${rpcRowsCount} for RPC and ${networkRowsCount} for the network`)
			}
			else {
				console.log(`Row counts coincide at ${rpcRowsCount}, commencing individual fields comparison`)
				for (let cf of comparedFields) {
					const cfComparison = await client.query(comparisonQuery(cf))
					if (cfComparison.rows.length>0) {
						console.log(`Field ${cf} differs at ${cfComparison.rows.length} rows, see query ${comparisonQuery(cf)}`)
					}
				}
			}
		}
	}
}

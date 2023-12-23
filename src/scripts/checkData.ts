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
		const comparedFields = fields[table]
			.filter(f => f!=='id' && f!=='data_source')
			.map(f => {
				if (f==='from')
					return `"from"`
				if (f==='to')
					return `"to"`
				return f
			})
		const orderField = table==='block' ? 'height' : 'block'
		function selectQuery(dataSource: 'rpc' | 'network') {
			return `select ${comparedFields.join(', ')}
				from ${table}
				where network='${network}' and test_id='${testId}' and data_source='${dataSource}'
				order by ${orderField} asc, id asc`
		}

		const comparisonQuery = `select * from (${selectQuery('rpc')}) as rpc_query except select * from (${selectQuery('network')}) as network_query`
		const comparison = await client.query(comparisonQuery)
		if (comparison.rows.length>0) {
			console.log(`comparison query`, comparisonQuery, `returned ${comparison.rows.length} rows`)
		}
	}
}

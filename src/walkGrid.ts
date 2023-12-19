import child_process from 'child_process'
import {createLogger} from '@subsquid/logger'

import networks from './networks'

const testsLog = createLogger('processor-tests')

for (let [nname, nparams] of Object.entries(networks)) {
	testsLog.info(`Gathering data for tests on network ${nname}...`)
	for (let [testIndex, test] of nparams.tests.entries()) {
		testsLog.info(`${test.id}/RPC in progress`)
		child_process.execFileSync('node', ['lib/main', nname, `${testIndex}`, 'rpc'], {stdio: 'inherit'})
		testsLog.info(`${test.id}/Network in progress`)
		child_process.execFileSync('node', ['lib/main', nname, `${testIndex}`, 'network'], {stdio: 'inherit'})
	}
}

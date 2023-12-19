import {FieldSelection, EvmBatchProcessor} from '@subsquid/evm-processor'

export interface NetworksConfig { [k: string]: NetworkTestsConfig }

interface NetworkTestsConfig {
	v2alias: string
	rpc: string
  finalityConfirmations: number
	tests: TestConditions[]
}

export interface TestConditions {
	id: string
	transaction?: Parameters<EvmBatchProcessor['addTransaction']>[0][]
	log?: Parameters<EvmBatchProcessor['addLog']>[0][]
	trace?: Parameters<EvmBatchProcessor['addTrace']>[0][]
	stateDiff?: Parameters<EvmBatchProcessor['addStateDiff']>[0][]
	fields: FieldSelection
}

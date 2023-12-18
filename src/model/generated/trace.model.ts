import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Trace {
    constructor(props?: Partial<Trace>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    block!: number

    @Index_()
    @Column_("text", {nullable: false})
    testId!: string

    @Index_()
    @Column_("text", {nullable: false})
    network!: string

    @Index_()
    @Column_("text", {nullable: false})
    dataSource!: string

    @Column_("int4", {nullable: true})
    transaction!: number | undefined | null

    @Column_("int4", {nullable: false})
    transactionIndex!: number

    @Column_("int4", {array: true, nullable: false})
    traceAddress!: (number | undefined | null)[]

    @Column_("text", {nullable: false})
    type!: string

    @Column_("int4", {nullable: false})
    subtraces!: number

    @Column_("text", {nullable: true})
    error!: string | undefined | null

    @Column_("text", {nullable: true})
    createFrom!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    createValue!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    createGas!: bigint | undefined | null

    @Column_("text", {nullable: true})
    createInit!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    createResultGasUsed!: bigint | undefined | null

    @Column_("text", {nullable: true})
    createResultCode!: string | undefined | null

    @Column_("text", {nullable: true})
    createResultAddress!: string | undefined | null

    @Column_("text", {nullable: true})
    callFrom!: string | undefined | null

    @Column_("text", {nullable: true})
    callTo!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    callValue!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    callGas!: bigint | undefined | null

    @Column_("text", {nullable: true})
    callSighash!: string | undefined | null

    @Column_("text", {nullable: true})
    callInput!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    callResultGasUsed!: bigint | undefined | null

    @Column_("text", {nullable: true})
    callResultOutput!: string | undefined | null

    @Column_("text", {nullable: true})
    suicideAddress!: string | undefined | null

    @Column_("text", {nullable: true})
    suicideRefundAddress!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    suicideBalance!: bigint | undefined | null

    @Column_("text", {nullable: true})
    rewardAuthor!: string | undefined | null

    @Column_("text", {nullable: true})
    rewardValue!: string | undefined | null

    @Column_("text", {nullable: true})
    rewardType!: string | undefined | null
}

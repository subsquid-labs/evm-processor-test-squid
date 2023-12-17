import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
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

    @Column_("int4", {array: true, nullable: true})
    logs!: (number | undefined | null)[] | undefined | null

    @Column_("int4", {array: true, nullable: true})
    stateDiffs!: (number | undefined | null)[] | undefined | null

    @Column_("int4", {nullable: false})
    transactionIndex!: number

    @Column_("text", {nullable: true})
    from!: string | undefined | null

    @Column_("text", {nullable: true})
    to!: string | undefined | null

    @Column_("text", {nullable: true})
    hash!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    gas!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    gasPrice!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    maxFeePerGas!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    maxPriorityFeePerGas!: bigint | undefined | null

    @Column_("text", {nullable: true})
    input!: string | undefined | null

    @Column_("int4", {nullable: true})
    nonce!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    value!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    v!: bigint | undefined | null

    @Column_("text", {nullable: true})
    r!: string | undefined | null

    @Column_("text", {nullable: true})
    s!: string | undefined | null

    @Column_("int4", {nullable: true})
    yParity!: number | undefined | null

    @Column_("int4", {nullable: true})
    chainId!: number | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    gasUsed!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    cumulativeGasUsed!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    effectiveGasPrice!: bigint | undefined | null

    @Column_("text", {nullable: true})
    contractAddress!: string | undefined | null

    @Column_("int4", {nullable: true})
    type!: number | undefined | null

    @Column_("int4", {nullable: true})
    status!: number | undefined | null

    @Column_("text", {nullable: true})
    sighash!: string | undefined | null
}

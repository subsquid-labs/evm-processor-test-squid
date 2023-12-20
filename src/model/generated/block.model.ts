import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    testId!: string

    @Index_()
    @Column_("text", {nullable: false})
    network!: string

    @Index_()
    @Column_("text", {nullable: false})
    dataSource!: string

    @Column_("text", {nullable: false})
    hash!: string

    @Index_()
    @Column_("int4", {nullable: false})
    height!: number

    @Column_("text", {nullable: false})
    parentHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    timestamp!: bigint | undefined | null

    @Column_("text", {nullable: true})
    nonce!: string | undefined | null

    @Column_("text", {nullable: true})
    sha3Uncles!: string | undefined | null

    @Column_("text", {nullable: true})
    logsBloom!: string | undefined | null

    @Column_("text", {nullable: true})
    transactionsRoot!: string | undefined | null

    @Column_("text", {nullable: true})
    stateRoot!: string | undefined | null

    @Column_("text", {nullable: true})
    receiptsRoot!: string | undefined | null

    @Column_("text", {nullable: true})
    mixHash!: string | undefined | null

    @Column_("text", {nullable: true})
    miner!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    difficulty!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    totalDifficulty!: bigint | undefined | null

    @Column_("text", {nullable: true})
    extraData!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    size!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    gasLimit!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    gasUsed!: bigint | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    baseFeePerGas!: bigint | undefined | null
}

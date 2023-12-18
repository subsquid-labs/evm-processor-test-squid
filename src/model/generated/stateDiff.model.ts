import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class StateDiff {
    constructor(props?: Partial<StateDiff>) {
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

    @Column_("text", {nullable: false})
    address!: string

    @Column_("text", {nullable: false})
    key!: string

    @Column_("text", {nullable: true})
    kind!: string | undefined | null

    @Column_("text", {nullable: true})
    prev!: string | undefined | null

    @Column_("text", {nullable: true})
    next!: string | undefined | null
}

import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class Log {
    constructor(props?: Partial<Log>) {
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
    logIndex!: number

    @Column_("int4", {nullable: false})
    transactionIndex!: number

    @Column_("text", {nullable: true})
    address!: string | undefined | null

    @Column_("text", {nullable: true})
    data!: string | undefined | null

    @Column_("text", {array: true, nullable: true})
    topics!: (string | undefined | null)[] | undefined | null

    @Column_("text", {nullable: true})
    transactionHash!: string | undefined | null
}

import { Stream } from "@most/types";
import { IClient } from "./type";
import { watchContractEvent } from "./utils/common";
import { CONTRACT } from "puppet-const";


export type IGmxEventLog1 = ReturnType<typeof streamGmxEventLog1> extends Stream<infer T> ? T : never
export const streamGmxEventLog1 = (client: IClient) => watchContractEvent(client, {
    ...CONTRACT[42161].EventEmitter,
    eventName: 'EventLog1'
})

export type IGmxEventLog2 = ReturnType<typeof streamGmxEventLog2> extends Stream<infer T> ? T : never
export const streamGmxEventLog2 = (client: IClient) => watchContractEvent(client, {
    ...CONTRACT[42161].EventEmitter,
    eventName: 'EventLog2'
})
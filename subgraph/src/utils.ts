import { EventLog as EventLogCtx, GMX_EventEmitter_EventLog1_eventArgs } from "generated";
import { BASIS_POINTS_DIVISOR } from "./const";

export type EventLog = EventLogCtx<GMX_EventEmitter_EventLog1_eventArgs>
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
}

export function getAddressItem(log: EventLog, idx: number) {
  return log.params.eventData[0][0][idx][1]
}

export function getAddressItemList(log: EventLog, idx: number) {
  return log.params.eventData[0][1][idx][1]
}

export function getUintItem(log: EventLog, idx: number) {
  return log.params.eventData[1][0][idx][1]
}

export function getUintItemList(log: EventLog, idx: number) {
  return log.params.eventData[1][1][idx][1]
}

export function getIntItem(log: EventLog, idx: number) {
  return log.params.eventData[2][0][idx][1]
}

export function getIntItemList(log: EventLog, idx: number) {
  return log.params.eventData[2][1][idx][1]
}

export function getBoolItem(log: EventLog, idx: number) {
  return log.params.eventData[3][0][idx][1]
}

export function getBoolItemList(log: EventLog, idx: number) {
  return log.params.eventData[3][1][idx][1]
}

export function getBytes32Item(log: EventLog, idx: number) {
  return log.params.eventData[4][0][idx][1]
}

export function getBytes32ItemList(log: EventLog, idx: number) {
  return log.params.eventData[4][1][idx][1]
}

export function getBytesItem(log: EventLog, idx: number) {
  return log.params.eventData[5][0][idx][1]
}

export function getBytesItemList(log: EventLog, idx: number) {
  return log.params.eventData[5][1][idx][1]
}

export function getStringItem(log: EventLog, idx: number) {
  return log.params.eventData[6][0][idx][1]
}

export function getStringItemList(log: EventLog, idx: number) {
  return log.params.eventData[6][1][idx][1]
}

export function toBasisPoints(value: bigint, divisor: bigint): bigint {
  if (divisor === 0n) return 0n

  return value * BASIS_POINTS_DIVISOR / divisor
}

export function applyBasisPoints(bps: bigint, value: bigint): bigint {
  return value * bps / BASIS_POINTS_DIVISOR
}


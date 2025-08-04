export type TimelineItem<T> = {
  time: number
  slot: number
  value: T
}

export interface ICreateTimeline<TSource, TMap, TResult extends TimelineItem<TMap>> {
  ticks?: number
  lastTime?: number
  sourceList: TSource[]

  getTime: (t: TSource) => number
  sourceMap: (next: TSource, timeslot: number) => TMap
  gapMap?: (next: TResult, timeslot: number) => TResult
  squashMap?: (conflict: TResult, next: TSource, timeslot: number) => TMap
}

export function fillTimeline<TSource, TMap, TResult extends TimelineItem<TMap>>(
  config: ICreateTimeline<TSource, TMap, TResult>
): TResult[] {
  const {
    ticks = 30,
    sourceList,
    sourceMap,
    gapMap = prev => prev,
    squashMap = (_prev, next, timeslot) => sourceMap(next, timeslot),
    getTime
  } = config

  // const sortedSource = source.filter((update, i) => getTime(update, i) > seed.time).sort((a, b) => getTime(a) - getTime(b))

  if (sourceList.length === 0) {
    return []
  }

  const initialTime = getTime(sourceList[0])
  const lastTime = getTime(sourceList[sourceList.length - 1])
  const interval = Math.floor((lastTime - initialTime) / ticks)

  const seedSlot = Math.floor(initialTime / interval)
  const seedTimeSlot = seedSlot * interval
  const seedMap = { time: seedTimeSlot, slot: seedSlot, value: sourceMap(sourceList[0], seedTimeSlot) } as TResult
  const timelineMap: { [k: number]: TResult } = {}

  timelineMap[seedSlot] = seedMap

  let prev = seedMap
  for (let i = 1; i < sourceList.length; i++) {
    const source = sourceList[i]
    const sourceTime = getTime(sourceList[i])

    if (getTime(sourceList[i - 1]) > sourceTime) {
      throw new Error('source has to be sorted')
    }

    const timeSlot = Math.floor(sourceTime / interval)
    const squashPrev = timelineMap[timeSlot]

    if (squashPrev) {
      const item = {
        time: squashPrev.time,
        slot: timeSlot,
        value: squashMap(squashPrev, source, timeSlot)
      } as TResult

      timelineMap[timeSlot] = item
      prev = item
      continue
    }

    const gapSpan = timeSlot - prev.slot
    for (let i = 1; i !== gapSpan; i++) {
      const gapTimeSlot = prev.slot + i

      if (timelineMap[gapTimeSlot]) {
        throw new Error('Gap time slot conlides with existing time slot')
      }

      const gapTimeslot = gapTimeSlot * interval
      timelineMap[gapTimeSlot] = {
        time: gapTimeslot,
        slot: gapTimeSlot,
        value: gapMap(prev, gapTimeSlot).value
      } as TResult
      // prev = timelineMap[prev.time]
    }

    const item = { time: timeSlot * interval, slot: timeSlot, value: sourceMap(source, timeSlot) } as TResult

    timelineMap[timeSlot] = item
    prev = item
  }

  return Object.values(timelineMap)
}

import type { Fragment, Path, Route } from 'aelea/router'
import { constant, filter, type IStream, join, op, switchLatest, until } from 'aelea/stream'

export function isMatched(frag: Fragment, path: Path) {
  if (frag instanceof RegExp) {
    return Boolean(path?.match(frag))
  }
  return frag === path
}

export const contains =
  <T>(route: Route) =>
  (ns: IStream<T>) => {
    return op(route.contains, constant(until(route.miss, ns)), switchLatest)
  }

export const match =
  <T>(route: Route) =>
  (ns: IStream<T>) => {
    const exactMatch = filter(isMatch => isMatch, route.match)
    const unmatch = filter(isMatch => !isMatch, route.match)

    return join(constant(until(unmatch, ns), exactMatch))
  }

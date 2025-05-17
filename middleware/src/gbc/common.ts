import { svgParts } from './mappings/svgParts.js'
import {
  AttributeBackground,
  AttributeBadge,
  AttributeBody,
  AttributeClothes,
  AttributeExpression,
  AttributeFaceAccessory,
  AttributeHat,
  type IBerryDisplayTupleMap
} from './types.js'

export const labAttributeTuple = [
  AttributeBackground,
  AttributeClothes,
  AttributeBody,
  AttributeExpression,
  AttributeFaceAccessory,
  AttributeHat,
  AttributeBadge
] as const

export const getLabItemTupleIndex = (itemId: number) => {
  const attrMap =
    itemId in AttributeHat
      ? AttributeHat
      : itemId in AttributeBackground
        ? AttributeBackground
        : itemId in AttributeClothes
          ? AttributeClothes
          : itemId in AttributeFaceAccessory
            ? AttributeFaceAccessory
            : itemId in AttributeExpression
              ? AttributeExpression
              : itemId in AttributeBadge
                ? AttributeBadge
                : null

  if (attrMap === null) {
    throw new Error(`item id: ${itemId} doesn't match any attribute`)
  }

  return labAttributeTuple.indexOf(attrMap)
}

export const berrySvg = (tuple: Partial<IBerryDisplayTupleMap>) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet" fill="none" viewBox="0 0 1500 1500">${berryPartsToSvg(tuple)}</svg>`
}

export const berryPartsToSvg = ([
  background,
  clothes,
  body,
  expression,
  faceAccessory,
  hat,
  badge
]: Partial<IBerryDisplayTupleMap>) => {
  return `
    ${background ? svgParts[0][background] : ''}
    ${svgParts[1][clothes ? clothes : AttributeClothes.NUDE]}
    ${svgParts[2][body ? body : AttributeBody.BLUEBERRY]}
    ${expression ? svgParts[3][expression] : ''}
    ${faceAccessory ? svgParts[4][faceAccessory] : ''}
    ${svgParts[5][hat ? hat : AttributeHat.NUDE]}
    ${badge ? svgParts[6][badge] : ''}
  `
}

export function getBerryFromItems(items: number[]) {
  const seedObj = { background: 0, badge: 0, custom: 0 }

  return items.reduce((seed, next) => {
    const ndx = getLabItemTupleIndex(next)

    if (ndx === 0) {
      seed.background = next
    } else if (ndx === 6) {
      seed.badge = next
    } else {
      seed.custom = next
    }

    return seed
  }, seedObj)
}

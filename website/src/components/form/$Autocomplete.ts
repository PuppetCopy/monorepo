// import { IBehavior, combineState, isEmpty, O, Op } from "aelea/core"
// import { $element, I$Node, $text, attr, component, eventElementTarget, INode, INode, NodeComposeFn, nodeEvent, style, styleBehavior, styleInline, stylePseudo } from "aelea/core"
// import { $column, $icon, $row, Input, layoutSheet, observer } from "aelea/ui-components"
// import { pallete } from "aelea/ui-components-theme"
// import { constant, empty, filter, map, merge, mergeArray, multicast, never, now, scan, skip, skipRepeats, snapshot, startWith, switchLatest, take, tap, zip } from "@most/core"
// import { append, remove } from "@most/prelude"
// import { Stream } from "@most/types"
// import { $xCross } from "@puppet/middleware/ui-components"
// import { streamOf } from "@puppet/middleware/utils"
// import { $caretDown } from "../../common/elements/$icons.js"
// import { $Select, ISelect } from "./$Select.js"

// export interface IMultiselect<T> extends ISelect<T> {

// }

// export interface IDropdown<T> {
//   selector: ISelect<T>
//   dropWidth?: number,
//   $selection: I$Node
//   $container?: INodeCompose
//   $option?: INodeCompose

//   openMenuOp?: IOps<MouseEvent, MouseEvent>
// }

// export const $defaultOptionContainer = $row(
//   spacing.small,
//   style({ alignItems: 'center', borderBottom: `1px solid ${pallete.horizon}`, padding: '12px 20px', width: '100%' }),
//   style({ cursor: 'pointer' }),
//   stylePseudo(':hover', { backgroundColor: pallete.horizon })
// )
// export const $defaultSelectContainer = $column(
//   style({
//     left: 0,
//     minWidth: '80px', overflow: 'hidden',
//     border: `1px solid ${pallete.horizon}`,
//     borderRadius: '20px',
//     backgroundColor: pallete.background,
//     boxShadow: `rgb(0 0 0 / 21%) 1px 1px 14px`
//   })
// )

// export const $defaultDropMultiSelectContainer = $row(spacing.tiny, style({ borderBottom: `1px solid ${pallete.message}` }))
// export const $defaultDropMultiSelectOption = $row(spacing.small,
//   style({
//     overflow: 'hidden', border: `1px solid ${pallete.message}`,
//     alignItems: 'center', padding: '4px 8px', width: '100%'
//   }),
//   stylePseudo(':hover', { backgroundColor: pallete.horizon })
// )
// export const $defaultChip = $row(style({ backgroundColor: pallete.primary, paddingLeft: '4px', cursor: 'default', alignItems: 'center', borderRadius: '22px' }))

// export interface IMultiselectDrop<T> extends Input<T[]> {
//   placeholder?: string
//   closeOnSelect?: boolean
//   getId?: (item: T) => string | number

//   selector: Omit<IMultiselect<T>, 'value'>

//   $label?: I$Node

//   $container?: INodeCompose
//   $fieldcontainer?: INodeCompose
//   $dropdownContainer?: INodeCompose

//   $chip?: INodeCompose
//   $input?: INodeCompose<I$Node<HTMLInputElement>>
//   $$chip: IOps<T, I$Node>
//   openMenu?: Stream<any>
// }

// export const $DropMultiSelect = <T>({
//   $container = $column(spacing.tiny, style({ display: 'flex', position: 'relative' })),
//   $fieldcontainer = $defaultDropMultiSelectContainer,
//   $$chip,
//   $label = empty(),
//   $chip = $defaultChip,
//   selector,
//   placeholder,
//   validation = never,
//   value,
//   closeOnSelect = true,
//   openMenu = empty(),
//   $input = $element('input'),
//   getId,
// }: IMultiselectDrop<T>
// ) => component((
//   [pick, pickTether]: IBehavior<T, T>,
//   [targetIntersection, targetIntersectionTether]: IBehavior<INode, IntersectionObserverEntry[]>,

//   [interaction, interactionTether]: IBehavior<INode, true>,
//   [blur, blurTether]: IBehavior<INode, false>,

//   [focusField, focusFieldTether]: IBehavior<INode, FocusEvent>,
//   [inputSearch, inputSearchTether]: IBehavior<INode<HTMLInputElement>, string>,
//   [clickOptionRemove, clickOptionRemoveTether]: IBehavior<INode, T>,
// ) => {

//   const openTrigger = mergeArray([focusField, constant(true, openMenu)])
//   const closeTrigger = constant(false, mergeArray([
//     // delay(100, blur),
//     closeOnSelect ? pick : empty()
//   ]))
//   const isOpen = mergeArray([openTrigger, closeTrigger])
//   const focus = startWith(false, merge(interaction, blur))

//   const select = switchLatest(
//     map(initSeedList => {
//       return skip(1, scan((seed, next) => {
//         const matchedIndex = getId ? seed.findIndex(item => getId(item) === getId(next)) : seed.indexOf(next)

//         if (matchedIndex === -1) {
//           return append(next, seed)
//         }

//         return remove(matchedIndex, seed)
//       }, initSeedList, mergeArray([pick, clickOptionRemove])))
//     }, value)
//   )

//   const selectionChange = merge(select, value)
//   const alert = validation(selectionChange)
//   const state = combineState({ focus, alert })

//   return [
//     $container(

//       $row(layoutSheet.flex, spacing.tiny, style({ display: 'flex', flexDirection: 'row', position: 'relative' }))(
//         isEmpty($label)
//           ? empty()
//           : $row(style({ alignSelf: 'flex-end', cursor: 'pointer' }))(
//             $label
//           ),

//         $fieldcontainer(
//           styleBehavior(
//             map(({ focus, alert }) => {
//               if (alert) {
//                 return { borderColor: pallete.negative }
//               }

//               return focus ? { borderColor: pallete.foreground } : null
//             }, state)
//           ),
//           targetIntersectionTether(
//             observer.intersection(),
//             multicast
//           ),
//           layoutSheet.flex, spacing.small, style({ alignItems: 'center', position: 'relative', flexWrap: 'wrap' })
//         )(
//           switchLatest(map(valueList => {
//             return mergeArray(valueList.map(token => {

//               return $chip(
//                 switchLatest($$chip(now(token))),
//                 $icon({
//                   $content: $xCross, width: '32px',
//                   svgOps: O(
//                     style({ padding: '6px', cursor: 'pointer' }),
//                     clickOptionRemoveTether(nodeEvent('click'), tap(x => x.preventDefault()), constant(token))
//                   ),
//                   viewBox: '0 0 32 32'
//                 })
//               )
//             }))
//           }, selectionChange)),

//           $row(style({ alignItems: 'center', flex: '1', alignSelf: 'stretch' }))(
//             $input(
//               attr({ placeholder: placeholder || '', autocomplete: 'off', 'data-lpignore': 'true' }),

//               interactionTether(interactionOp),
//               blurTether(dismissOp),

//               style({
//                 border: 'none',
//                 fontSize: '1em',
//                 alignSelf: 'stretch',
//                 outline: 'none',
//                 minHeight: '36px',
//                 flex: '1 0 100px',
//                 color: pallete.message,
//                 background: 'transparent',
//               }),

//               inputSearchTether(
//                 nodeEvent('input'),
//                 map(inputEv => {
//                   if (inputEv.target instanceof HTMLInputElement) {
//                     const text = inputEv.target.value
//                     return text || ''
//                   }
//                   return ''
//                 })
//               ),

//               focusFieldTether(
//                 nodeEvent('pointerdown')
//               ),

//             )(),
//             $icon({ $content: $caretDown, width: '18px', svgOps: style({ marginTop: '3px', minWidth: '18px', marginLeft: '6px' }), viewBox: '0 0 32 32' }),
//           ),

//         ),

//         switchLatest(snapshot((params, show) => {
//           if (!show) {
//             return empty()
//           }

//           const $floatingContainer = (selector.$container || $defaultSelectContainer)(
//             style({
//               padding: '8px', zIndex: 50,
//               position: 'absolute', visibility: 'hidden'
//             })
//           )

//           const optionSelection = params.list.filter(n => {
//             const id = getId ? getId(n) : n
//             return params.selectionChange.findIndex(item => getId ? getId(item) === id : item === id) === -1
//           })

//           if (optionSelection.length === 0) {
//             return $floatingContainer($text('Nothing to select'))
//           }

//           const dropBehavior = O(
//             styleInline(
//               map(([rect]) => {
//                 const { bottom } = rect.intersectionRect

//                 const bottomSpcace = window.innerHeight - bottom
//                 const goDown = bottomSpcace > bottom

//                 return goDown
//                   ? {
//                     top: 'calc(100% + -1px)',
//                     borderTopLeftRadius: 0, borderTopRightRadius: 0,
//                     display: 'flex', visibility: 'visible'
//                   } : {
//                     bottom: 'calc(100% + -1px)', visibility: 'visible',
//                     borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
//                     display: 'flex'
//                   }
//               }, targetIntersection),

//             ),
//           )

//           return dropBehavior(
//             $Select({
//               ...selector,
//               $container: $floatingContainer,
//               list: optionSelection,
//               value: empty(),
//             })({
//               select: pickTether()
//             })
//           )
//         }, combineState({ list: streamOf(selector.list), selectionChange }), isOpen)),
//       ),

//       switchLatest(map(msg => {
//         if (!msg) {
//           return empty()
//         }

//         return $text(style({ color: pallete.negative, fontSize: '1.2rem', minHeight: '17px' }))(msg)
//       }, alert))

//     ),

//     {
//       select, alert
//     }
//   ]
// })

// export const interactionOp = O(
//   (src: I$Node) => merge(nodeEvent('focus', src), nodeEvent('pointerover', src)),
//   constant(true)
// )

// export const dismissOp = O(
//   (src: I$Node) => merge(nodeEvent('blur', src), nodeEvent('pointerout', src)),
//   filter(x => document.activeElement !== x.target,), // focused elements cannot be dismissed
//   constant(false)
// )

// // $Dropdown({
// //   openMenuOp: tap(event => {
// //     const sel = window.getSelection()
// //     const range = document.createRange()
// //     const target = event.target

// //     if (sel && target instanceof HTMLElement) {
// //       range.selectNodeContents(target)

// //       sel.removeAllRanges()
// //       sel.addRange(range)
// //     }
// //   }),
// //   $selection: $row(
// //     spacing.small, style({ alignItems: 'center', borderBottom: `2px solid ${pallete.message}` }),
// //     styleInline(map(isDisabled => isDisabled ? { opacity: ".15", pointerEvents: 'none' } : { opacity: "1", pointerEvents: 'all' }, accountChange))
// //   )(
// //     $text(
// //       attr({ contenteditable: 'true', placeholder: 'Set Amount' }), style({ padding: '15px 0 15px 10px', minWidth: '50px', backgroundColor: 'transparent', cursor: 'text', outline: '0' }),
// //       stylePseudo(':empty:before', {
// //         content: 'attr(placeholder)',
// //         color: pallete.foreground
// //       }),
// //       customNftAmountTether(
// //         nodeEvent('blur'),
// //         snapshot((state, event) => {
// //           const target = event.target

// //           if (target instanceof HTMLElement) {
// //             const val = Number(target.innerText)

// //             return target.innerText !== '' && isFinite(val) && val > 0 && val <= config.mintRule.accountLimit ? val : state
// //           }

// //           if (state === null) {
// //             return ''
// //           }

// //           return state
// //         }, startWith(null, selectMintAmount)),
// //         multicast
// //       )
// //     )(
// //       map(amount => amount === null ? '' : String(amount), selectMintAmount)
// //     ),
// //     $icon({ viewBox: '0 0 32 32', $content: $caretDown, width: '13px', svgOps: style({ marginTop: '2px', marginRight: '10px' }) })
// //   ),
// //   value: {
// //     $container: $defaultSelectContainer(style({})),
// //     value: startWith(null, customNftAmount),
// //     $$option: map(option => $text(String(option))),
// //     list: [1, 2, 3, 5, 10, 20].filter(n => Number(config.mintRule.accountLimit) >= n),
// //   }
// // })({
// //   select: selectMintAmountTether()
// // })

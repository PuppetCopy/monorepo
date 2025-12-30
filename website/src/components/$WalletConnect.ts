import { ignoreAll } from '@puppet/sdk/core'
import type { Connector } from '@wagmi/core'
import { map } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $element, $text, attr, component, style } from 'aelea/ui'
import { $column, $icon, $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import { $walletConnectLogo } from '../common/$icons.js'
import wallet, { connectWallet } from '../wallet/wallet.js'
import { $ButtonSecondary } from './form/$Button.js'
import { $defaultButtonCore } from './form/$ButtonCore.js'

const $walletIcon = (connector: Connector) => {
  const iconUrl =
    connector.icon ||
    (connector.id && connector.id !== 'default' && connector.id !== 'walletConnect'
      ? `https://explorer-api.walletconnect.com/v3/logo/md/${wallet.walletConnectProjectId}/${connector.id}`
      : null)
  const $wcLogo =
    connector.id === 'walletConnect'
      ? $icon({
          $content: $walletConnectLogo,
          viewBox: '0 0 32 32',
          width: '20px',
          svgOps: style({ width: '20px', height: '20px' })
        })
      : null
  const fallbackLabel = (connector.name || connector.id || '?').slice(0, 1).toUpperCase()

  const $content = $wcLogo
    ? $wcLogo
    : iconUrl
      ? $element('img')(
          attr({
            src: iconUrl,
            alt: `${connector.name || connector.id} icon`,
            loading: 'lazy'
          }),
          style({
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          })
        )()
      : $text(fallbackLabel)

  return $row(
    style({
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colorAlpha(pallete.foreground, 0.08),
      color: pallete.message,
      fontWeight: 'bold',
      flexShrink: '0'
    })
  )($content)
}

export const $WalletConnect = () =>
  component(
    (
      [connect, connectTether]: IBehavior<PointerEvent, ReturnType<typeof connectWallet>> //
    ) => {
      const connectors = wallet.wagmi.connectors.slice().reverse()

      return [
        $column(spacing.small)(
          ignoreAll(connect),
          ...connectors.map(connector =>
            $ButtonSecondary({
              $container: $defaultButtonCore(
                style({
                  color: pallete.message,
                  borderStyle: 'solid',
                  backgroundColor: pallete.background,
                  borderWidth: '1px',
                  borderRadius: '100px',
                  padding: '12px 16px',
                  borderColor: colorAlpha(pallete.foreground, 0.25)
                })
              ),
              $content: $row(spacing.default, style({ alignItems: 'center', width: '100%' }))(
                $walletIcon(connector),
                $text(connector.name || 'Connect Wallet')
              )
            })({
              click: connectTether(
                map(async () => {
                  const connecting = await connectWallet(connector.id)

                  return connecting
                }) //
                // awaitPromises,
                // map(x => Promise.resolve(x))
              )
            })
          )
        ),
        { connect }
      ]
    }
  )

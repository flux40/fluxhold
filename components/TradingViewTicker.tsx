'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    TradingView: any
  }
}

export default function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
      script.async = true
      script.innerHTML = JSON.stringify({
        symbols: [
          {
            proName: 'FOREXCOM:SPXUSD',
            title: 'S&P 500'
          },
          {
            proName: 'FOREXCOM:NSXUSD',
            title: 'US 100'
          },
          {
            proName: 'BITSTAMP:BTCUSD',
            title: 'Bitcoin'
          },
          {
            proName: 'BITSTAMP:ETHUSD',
            title: 'Ethereum'
          },
          {
            description: 'EURUSD',
            proName: 'FX:EURUSD'
          },
          {
            description: 'GBPJPY',
            proName: 'OANDA:GBPJPY'
          },
          {
            description: 'GBPUSD',
            proName: 'OANDA:GBPUSD'
          },
          {
            description: 'EURGBP',
            proName: 'FX:EURGBP'
          },
          {
            description: 'USDJPY',
            proName: 'OANDA:USDJPY'
          }
        ],
        showSymbolLogo: true,
        colorTheme: 'dark',
        isTransparent: true,
        displayMode: 'adaptive',
        locale: 'en',
        largeChartUrl: 'https://fluxhold.com'
      })
      
      containerRef.current?.appendChild(script)
    }

    // Load the TradingView script
    if (!document.querySelector('script[src*="tradingview.com"]')) {
      loadScript()
    }

    return () => {
      // Clean up if needed
      const script = document.querySelector('script[src*="tradingview.com"]')
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container w-full" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
      </div>
    </div>
  )
}
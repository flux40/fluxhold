"use client";

import { useEffect, useRef } from "react";

export default function ExactTradingView() {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const widgets = [
    {
      symbol: "COINBASE:BTCUSD",
      title: "symbol info TradingView widget",
      src: "https://www.tradingview-widget.com/embed-widget/symbol-info/?locale=en&symbol=COINBASE:BTCUSD#%7B%22symbol%22%3A%22COINBASE%3ABTCUSD%22%2C%22width%22%3A%22100%25%22%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22height%22%3A203%2C%22utm_source%22%3A%22fluxhold.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22symbol-info%22%2C%22page-uri%22%3A%22fluxhold.com%2F%22%7D",
    },
    {
      symbol: "COINBASE:ETHUSD",
      title: "symbol info TradingView widget",
      src: "https://www.tradingview-widget.com/embed-widget/symbol-info/?locale=en&symbol=COINBASE:ETHUSD#%7B%22symbol%22%3A%22COINBASE%3AETHUSD%22%2C%22width%22%3A%22100%25%22%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22height%22%3A203%2C%22utm_source%22%3A%22fluxhold.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22symbol-info%22%2C%22page-uri%22%3A%22fluxhold.com%2F%22%7D",
    },
    {
      symbol: "COINBASE:SOLUSD",
      title: "symbol info TradingView widget",
      src: "https://www.tradingview-widget.com/embed-widget/symbol-info/?locale=en&symbol=COINBASE:SOLUSD#%7B%22symbol%22%3A%22COINBASE%3ASOLUSD%22%2C%22width%22%3A%22100%25%22%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22height%22%3A203%2C%22utm_source%22%3A%22fluxhold.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22symbol-info%22%2C%22page-uri%22%3A%22fluxhold.com%2F%22%7D",
    },
    {
      symbol: "BINANCE:XRPUSD",
      title: "symbol info TradingView widget",
      src: "https://www.tradingview-widget.com/embed-widget/symbol-info/?locale=en&symbol=BINANCE:XRPUSD#%7B%22symbol%22%3A%22BINANCE%3AXRPUSD%22%2C%22width%22%3A%22100%25%22%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22height%22%3A203%2C%22utm_source%22%3A%22fluxhold.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22symbol-info%22%2C%22page-uri%22%3A%22fluxhold.com%2F%22%7D",
    },
  ];

  // Add TradingView widget styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .tradingview-widget-copyright {
        font-size: 13px !important;
        line-height: 32px !important;
        text-align: center !important;
        vertical-align: middle !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif !important;
        color: #B2B5BE !important;
      }

      .tradingview-widget-copyright .blue-text {
        color: #2962FF !important;
      }

      .tradingview-widget-copyright a {
        text-decoration: none !important;
        color: #B2B5BE !important;
      }

      .tradingview-widget-copyright a:visited {
        color: #B2B5BE !important;
      }

      .tradingview-widget-copyright a:hover .blue-text {
        color: #1E53E5 !important;
      }

      .tradingview-widget-copyright a:active .blue-text {
        color: #1848CC !important;
      }

      .tradingview-widget-copyright a:visited .blue-text {
        color: #2962FF !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="py-8 bg-gradient-to-b from-[#0B1C2D] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TradingView Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map((widget, index) => (
            <div key={widget.symbol} className="tradingview-widget-wrapper">
              <div
                ref={(el) => {
                  containerRefs.current[index] = el;
                }}
                className="tradingview-widget-container bg-[#0B1C2D] rounded-xl overflow-hidden border border-gray-800"
                style={{ width: "100%", height: "262px" }}
              >
                <iframe
                  scrolling="no"
                  allowTransparency={true}
                  frameBorder="0"
                  src={widget.src}
                  title={widget.title}
                  lang="en"
                  style={{
                    userSelect: "none",
                    boxSizing: "border-box",
                    display: "block",
                    height: "262px",
                    width: "100%",
                    border: "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

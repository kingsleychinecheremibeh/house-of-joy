import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default async function Icon() {
  // Load Playfair Display — the same font already used on the website
  const playfairFont = await fetch(
    new URL('https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQ.woff2')
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#faf9f6', // same cream as the website
          position: 'relative',
        }}
      >
        {/* thin gold border frame */}
        <div
          style={{
            position: 'absolute',
            inset: '28px',
            border: '1.5px solid #d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        {/* HJ monogram */}
        <span
          style={{
            fontFamily: '"Playfair Display"',
            fontSize: '210px',
            color: '#1a1a1a',
            letterSpacing: '0.05em',
            lineHeight: 1,
            paddingBottom: '8px',
          }}
        >
          HJ
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Playfair Display',
          data: playfairFont,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}

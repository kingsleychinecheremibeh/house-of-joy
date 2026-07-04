import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default async function Icon() {
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
            fontFamily: 'serif',
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
    }
  )
}

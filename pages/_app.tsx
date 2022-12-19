import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { Noto_Sans_JP } from '@next/font/google'

const noto = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['japanese'],
  style: ['normal']
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${noto.style.fontFamily};
        }
      `}</style>

      <Component {...pageProps} />
    </>
  );
}

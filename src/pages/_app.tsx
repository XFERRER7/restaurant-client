import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import { Context } from '../contexts/Context'
import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';

const poppins = Poppins({ style: 'normal', weight: '400', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return <div className={poppins.className}>
    <Context>
      <Component {...pageProps} />
    </Context>
  </div>
}

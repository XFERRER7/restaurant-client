import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({ style: 'normal', weight: '400', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return <div className={poppins.className}>
    <Component {...pageProps} />
    <ToastContainer />
  </div>
}

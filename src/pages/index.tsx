import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"


export default function Home() {

  return (
    <div>
      Home
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {

  const cookies = parseCookies(context)
  const token = cookies.token;
  const userType = cookies.userType

  if (!token) {
    return {
      redirect: {
        destination: userType === 'admin' ? '/login/admin' : '/login/client',
        permanent: false
      }
    }
  }


  return {
    props: {}
  }
}

// Layout Imports

import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import ReactQueryProvider from '@/components/ReactQueryProvider'

const Layout = async ({ children }) => {
  // Vars
  const direction = 'ltr'
  const session = await getServerSession(authOptions)
  console.log('session', session)

  if (!session) {
    redirect('/login')
  }

  return (
    <Providers direction={direction}>
       <ReactQueryProvider>
        
      <LayoutWrapper
        verticalLayout={
          <VerticalLayout navigation={<Navigation />} navbar={<Navbar />} footer={<VerticalFooter />}>
            {children}
          </VerticalLayout>
        }
        />
        </ReactQueryProvider>
    </Providers>
  )
}

export default Layout

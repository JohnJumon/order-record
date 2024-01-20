import RequireAuth from "./views/RequireAuth"
import { useLocation } from 'react-router-dom'

interface AppProps {
  children: React.ReactNode
}

function App(props: AppProps) {
  const location = useLocation()

  const showDrawer = location.pathname !== '/'
  return (
    <>
      {showDrawer && <RequireAuth>{props.children}</RequireAuth>}
      {!showDrawer && props.children}
    </>
  )
}

export default App
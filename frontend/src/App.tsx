import RequireAuth from "./views/RequireAuth"
import MiniDrawer from "./views/components/Drawer"
import { useLocation } from 'react-router-dom'

interface AppProps {
  children: React.ReactNode
}

function App(props: AppProps) {
  const location = useLocation()

  const showDrawer = location.pathname !== '/'
  return (
    <>
      {showDrawer && <MiniDrawer><RequireAuth>{props.children}</RequireAuth></MiniDrawer>}
      {!showDrawer && props.children}
    </>
  )
}

export default App
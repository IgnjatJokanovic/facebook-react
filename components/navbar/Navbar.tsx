import Link from 'next/link'
import FriendNotifications from './friends/FriendNotifications'
import MessageNotifications from './messages/MessageNotifications'
import Notifications from './notifications/Notifications'
import Search from './search/Search'
import Settings from './settings/Settings'
import { useContext } from 'react'
import Context from '../../context/context'

export default function Navbar() {
  const ctx = useContext(Context);

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <Link href="/">
          <img src="/logo.png" alt="facebook-logo" />
        </Link>
        { ctx.authenticated ?  ( <Search />) : ''}
      </div>
      {ctx.authenticated ? (
        <div className="navigation-container">
          <FriendNotifications />
          <MessageNotifications />
          <Notifications />
          <Settings />
        </div>
      ) : '' }
      
    </div>
  )
}

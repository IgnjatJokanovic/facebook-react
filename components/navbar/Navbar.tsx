import Link from 'next/link'
import FriendNotifications from './friends/FriendNotifications'
import MessageNotifications from './messages/MessageNotifications'
import Notifications from './notifications/Notifications'
import Search from './search/Search'
import Settings from './settings/Settings'

export default function Navbar() {
  return (
    <div className="navbar-container">
      <div className="logo-container">
        <Link href="/">
          <img src="/logo.png" alt="facebook-logo" />
        </Link>
        <Search />
      </div>
      <div className="navigation-container">
        <FriendNotifications />
        <MessageNotifications />
        <Notifications />
        <Settings />
      </div>
    </div>
  )
}

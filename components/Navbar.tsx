import Link from 'next/link'
import FriendNotifications from './navbar/friends/FriendNotifications'
import MessageNotifications from './navbar/messages/MessageNotifications'
import Notifications from './navbar/notifications/Notifications'
import Search from './navbar/search/Search'
import Settings from './navbar/settings/Settings'

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

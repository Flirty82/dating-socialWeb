import { Link } from 'react-router-dom';

const Sidebar = () => {
    <nav className="sidebar">
        <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/feed">Activity Feed</Link></li>
            <li><Link to="/messages">Messages</Link></li>
            <li><Link to="/flirts">Flirts</Link></li>
            <li><Link to="/invites">Invites</Link></li>
            <li><Link to="/games">Games</Link></li>
            <li><Link to="settings">Settings</Link></li>
            <li><Link to="/logout">Logout</Link></li>

        </ul>
    </nav>
};

export default Sidebar;
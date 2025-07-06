import { useUser } from '../hooks/useUser';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const { user } = useUser();
    if (!user || user.membership !== 'diamond') {
        return <Navigate to="/upgrade" replace/>;
        return children;
    }
}
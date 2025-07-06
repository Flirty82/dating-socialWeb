import { useSocket } from '../context/SocketContest';
import { useState } from 'react';

const BingoHostPanel = ({ roomId }) => {
    const socket = useSocket();
    const [calledNumbers, setCalledNumbers] = useState([]);

    
} 
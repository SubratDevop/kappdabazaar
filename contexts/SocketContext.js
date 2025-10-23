import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import getAsyncStorageFn from '../utils/constants';

// // Replace with your actual server IP
const SOCKET_URL = 'http://192.168.35.170:9090/'; 
// const SOCKET_URL = `https://kapda-bazaar.theparamounttech.in/kapda/v1/api`; // change this to your base URL

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [user, setUser] = useState(null);

    // Fetch user details from AsyncStorage
    useEffect(() => {
        async function fetchDetails() {
            const res = await getAsyncStorageFn();
            setUser(res);
        }
        // fetchDetails();
    }, []);

    // Memoize the socket instance to prevent unnecessary reinitialization
    const socket = useMemo(() => {
        if (user?.role) {
            const id = user.role === 'superadmin' ? user.admin_id : user.user_id;
            const role_socket = user.role;

            if (id && role_socket) {

                socketRef.current = io(SOCKET_URL, {
                    transports: ['websocket'],
                    reconnection: true,
                    reconnectionAttempts: 10,
                    reconnectionDelay: 2000,
                    query: {
                        userId: id,
                        role: role_socket,
                    },
                });

                // Add event listeners for debugging and production readiness
                socketRef.current.on('connect', () => {
                });

                socketRef.current.on('disconnect', (reason) => {
                    if (reason === 'io server disconnect') {
                        // The server disconnected the socket, try to reconnect manually
                        socketRef.current.connect();
                    }
                });

                socketRef.current.on('connect_error', (error) => {
                    console.error('❌ Socket connection error:', error);
                });

                socketRef.current.on('reconnect_attempt', (attempt) => {
                });

                socketRef.current.on('reconnect', () => {
                });

                socketRef.current.on('reconnect_failed', () => {
                });

            }
            return () => {
                socketRef.current.disconnect();
                socketRef.current.off('connect');
            };
        }
        return null;
    }, [user]);

    // Cleanup the socket connection on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
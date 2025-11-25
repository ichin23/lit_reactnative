import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth';
import { makeFollowUseCases } from '../core/factories/makeFollowUseCases';

const { getPendingFollowRequests } = makeFollowUseCases();

interface FollowRequestContextData {
    pendingCount: number;
    refreshPendingCount: () => Promise<void>;
}

const FollowRequestContext = createContext<FollowRequestContextData>({} as FollowRequestContextData);

export function FollowRequestProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    const refreshPendingCount = async () => {
        if (!user) {
            setPendingCount(0);
            return;
        }

        try {
            const requests = await getPendingFollowRequests.execute(user.id);
            setPendingCount(requests.length);
        } catch (error) {
            console.error('Error fetching pending requests count:', error);
            setPendingCount(0);
        }
    };

    useEffect(() => {
        refreshPendingCount();

        // Refresh every 30 seconds
        const interval = setInterval(refreshPendingCount, 30000);

        return () => clearInterval(interval);
    }, [user]);

    return (
        <FollowRequestContext.Provider value={{ pendingCount, refreshPendingCount }}>
            {children}
        </FollowRequestContext.Provider>
    );
}

export function useFollowRequest() {
    const context = useContext(FollowRequestContext);
    if (!context) {
        throw new Error('useFollowRequest must be used within a FollowRequestProvider');
    }
    return context;
}

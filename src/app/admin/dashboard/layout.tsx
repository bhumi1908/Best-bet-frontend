"use client";

import { useState } from "react";
import AuthWrapper from "@/components/auth/AuthWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <AuthWrapper allowedRoles={['ADMIN']}>
            <div className="h-screen w-screen overflow-hidden bg-bg-primary">
                {/* Custom Scrollbar Styles */}
                <style jsx global>{`
                    /* Dashboard Scrollbar Styling */
                    main::-webkit-scrollbar {
                        width: 8px;
                    }
                    main::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    main::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    main::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    * {
                        scrollbar-width: thin;
                        scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
                    }
                `}</style>

                {/* Fixed Header */}
                <DashboardHeader onMenuToggle={toggleSidebar} isMenuOpen={isSidebarOpen} />

                {/* Fixed Sidebar */}
                <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                {/* Scrollable Content Area */}
                <main className="fixed left-0 md:left-64 top-16 right-0 bottom-0 overflow-y-auto overflow-x-hidden transition-all duration-300">
                    <div className="h-full min-h-fit w-full bg-black/50 text-text-primary p-0 sm:p-4">
                        <div className="min-h-full w-full bg-bg-secondary text-text-primary p-4 sm:p-6 rounded-lg">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </AuthWrapper>
    );
}

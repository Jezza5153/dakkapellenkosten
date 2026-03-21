/**
 * PermissionGate — role-based UI component
 * Hides children if user doesn't have the required role.
 * 
 * Usage:
 *   <PermissionGate role="admin">
 *     <DeleteButton />
 *   </PermissionGate>
 *
 *   <PermissionGate role={["admin", "editor"]}>
 *     <EditButton />
 *   </PermissionGate>
 */
"use client";

import { useSession } from "next-auth/react";
import { type ReactNode } from "react";

interface PermissionGateProps {
    role: string | string[];
    fallback?: ReactNode;
    children: ReactNode;
}

export default function PermissionGate({ role, fallback = null, children }: PermissionGateProps) {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;

    if (!userRole) return <>{fallback}</>;

    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(userRole)) return <>{fallback}</>;

    return <>{children}</>;
}

/**
 * Hook version for conditional logic in components
 */
export function usePermission(role: string | string[]): boolean {
    const { data: session } = useSession();
    const userRole = (session?.user as any)?.role;
    if (!userRole) return false;
    const allowedRoles = Array.isArray(role) ? role : [role];
    return allowedRoles.includes(userRole);
}

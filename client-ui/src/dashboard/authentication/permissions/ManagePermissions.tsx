import BASE_URL from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

// ✅ Skeleton Component
const SkeletonTable = () => {
    return (
        <div className="overflow-x-auto border rounded-xs animate-pulse">
            <table className="w-full text-sm border-collapse">
                <thead className="bg-muted">
                    <tr>
                        <th className="border px-3 py-7 w-1/3"></th>
                        {[...Array(4)].map((_, i) => (
                            <th key={i} className="border px-3 py-7"></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(6)].map((_, i) => (
                        <tr key={i}>
                            <td className="border px-3 py-3">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </td>

                            {[...Array(4)].map((_, j) => (
                                <td key={j} className="border text-center">
                                    <div className="h-5 w-10 bg-gray-300 rounded mx-auto"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default function ManagePermissions() {
    const [permissions, setPermissions] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    const [loadingTable, setLoadingTable] = useState(true);
    const [saving, setSaving] = useState(false);

    // ✅ Fetch Data
    const fetchData = async () => {
        try {
            setLoadingTable(true);

            const [permRes, roleRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/permissions/getpermission`),
                axios.get(`${BASE_URL}/api/admin/roles/getrole`),
            ]);

            setPermissions(permRes.data.data || []);
            setRoles(roleRes.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data ❌");
        } finally {
            setLoadingTable(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Toggle Permission
    const handleToggle = (roleId: string, permissionId: string) => {
        setRoles((prev) =>
            prev.map((role) => {
                if (role._id !== roleId) return role;

                const exists = role.permissionId.some(
                    (p: any) => p._id === permissionId
                );

                return {
                    ...role,
                    permissionId: exists
                        ? role.permissionId.filter((p: any) => p._id !== permissionId)
                        : [...role.permissionId, { _id: permissionId }],
                };
            })
        );
    };

    // ✅ Save All
    const handleSave = async () => {
        try {
            setSaving(true);

            await Promise.all(
                roles.map((role) =>
                    axios.put(
                        `${BASE_URL}/api/admin/roles/updaterole/${role._id}`,
                        {
                            permissionId: role.permissionId.map((p: any) => p._id),
                        }
                    )
                )
            );

            toast.success("All Permission Granted ✅");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Update failed ❌");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="p-4 space-y-4">
            {
                loadingTable ? (
                    <div className="animate-pulse">
                        <div className="h-7 bg-muted w-full md:w-80" />
                        <div className="h-4 bg-muted mt-1 w-full md:w-80" />
                    </div>
                ) : (
                    <div className="flex md:flex-row flex-col md:items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold">
                                Role Permission Matrix
                            </h1>
                            <p className="text-sm text-gray-400">
                                Manage permissions for each role
                            </p>
                        </div>
                        <Button className="md:w-fit w-full md:mt-0 mt-1">
                            <Link to='/dashboard/permissions'>All Permission</Link>
                        </Button>
                    </div>
                )
            }
            {/* ✅ Table / Skeleton */}
            {
                loadingTable ? (
                    <SkeletonTable />
                ) : (
                    <div className="overflow-x-auto rounded-xs">
                        <table className="w-full text-sm">

                            {/* Header */}
                            <thead className="sticky border top-0 bg-card z-10">
                                <tr>
                                    <th className="px-3 py-4 text-left">
                                        Permissions
                                    </th>

                                    {roles.map((role) => (
                                        <th
                                            key={role._id}
                                            className="px-3 py-2 text-center"
                                        >
                                            {role.role}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                                {permissions.map((perm) => (
                                    <tr key={perm._id}>
                                        {/* Permission Info */}
                                        <td className="border border-r-0 px-3 py-2">
                                            <p className="font-medium">
                                                {perm.permission}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {perm.description}
                                            </p>
                                        </td>

                                        {/* Role Columns */}
                                        {roles.map((role) => {
                                            const checked = role.permissionId.some(
                                                (p: any) => p._id === perm._id
                                            );

                                            return (
                                                <td
                                                    key={role._id}
                                                    className={`border text-center ${checked ? "bg-muted" : ""
                                                        }`}
                                                >
                                                    <Switch
                                                        checked={checked}
                                                        onCheckedChange={() =>
                                                            handleToggle(role._id, perm._id)
                                                        }
                                                        disabled={role.role === "Admin"} // optional
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }

            {/* ✅ Save Button */}
            <div>

                {
                    loadingTable ? (
                        <div className="animate-pulse">
                            <div className="h-10 bg-muted w-full md:w-40" />
                        </div>
                    ) : (
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save All Changes"}
                        </Button>
                    )
                }
            </div>
        </section >
    );
}
import { FC, useMemo, useState } from "react";
import { Filter } from "@/components/dashboard/admin/Filter";


export const RecentActivity: FC = () => {
    return (
        <div className="flex w-full flex-col rounded-xl bg-white p-6 max-h-[250px] ">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-xl font-semibold tracking-tight">Recent Activity</h1>
                <Filter />
            </div>
            <div className="flex flex-col overflow-y-auto">
                
            </div>
        </div>
    );
};

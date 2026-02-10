import {FC} from "react";
import FilterIcon from "@/components/icons/FilterIcon";
import {ChevronRight} from "lucide-react";

export const Filter:FC = () => {
    return <div className="flex gap-2.5 justify-center items-center bg-black/5 rounded px-2">
        <FilterIcon className="size-3.5"/>
        <p className="font-medium text-sm text-black/30">Filters</p>
        <ChevronRight className="size-3.5"/>
    </div>
}

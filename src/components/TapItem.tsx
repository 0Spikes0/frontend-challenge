import React from "react";
import { TapProps } from "../utils/interfaces";

const TapItem: React.FC<TapProps> = ({ title, icon, onClick, isActive }) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-2 cursor-pointer relative group"
        >
            {icon}
            <span>{title}</span>
            {/* Apply green line only if the item is active */}
            <div
                className={`absolute left-0 bottom-0 h-[2px] bg-green-500 transition-all duration-300 ease-in-out ${
                    isActive ? "w-full" : "w-0"
                }`}
            ></div>
        </div>
    );
};

export default TapItem;

import React from "react";
import { TapProps } from "../utils/interfaces";

const TapItem: React.FC<TapProps> = ({ title, icon }) => {
    return (
        <div className="flex items-center gap-2 cursor-pointer relative group">
            {icon}
            <span>{title}</span>
            <div className="absolute left-0 bottom-0 h-[2px] w-0 bg-green-500 transition-all duration-300 ease-in-out group-hover:w-full"></div>
        </div>
    );
};

export default TapItem;
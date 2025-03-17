'use client'

import React, { useState, useRef } from "react";
import { Plus, SearchIcon } from "lucide-react";

export const SearchInput = () => {
    const [value, setValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }
    const handleRemove = () => {
        setValue('')
        inputRef.current?.focus()
        
    }
    return ( 
        <form className="flex w-full max-w-[600px]">
            <div className="relative w-full">
                <input type="text"   ref={inputRef} onChange={handleSearch} value={value} placeholder="Search" className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500" />
                {/* Todo: add remove button */}
                <button type="button" onClick={handleRemove} className="absolute border-none  hover:border-gray-200 hover:bg-gray-200 rounded-full p-0  right-0 top-0 h-full    ">
                    <Plus className="size-10 rotate-45 -z-0" strokeWidth={0.5}/>
                </button>

            </div>
            <button type="submit" className="bg-gray-100 px-5 py-2.5 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <SearchIcon className="size-5"/>
            </button>
        </form>
    );
}
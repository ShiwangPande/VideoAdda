'use client'

import React, { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import {  useRouter, useSearchParams } from "next/navigation";
import { APP_URL } from "@/constants";
import { Button } from "@/components/ui/button";

export const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const [value, setValue] = useState(query)

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = new URL("/search", APP_URL);
        const newQuery = value.trim();

        url.searchParams.set("query", encodeURIComponent(newQuery));
        if(categoryId){
            url.searchParams.set("categoryId", categoryId);
        }
        if(newQuery === ""){
            url.searchParams.delete("query")
        }

        setValue(newQuery);
        router.push(url.toString());
    }
    return ( 
        <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
            <div className="relative w-full">
                <input 
                type="text"
                onChange={(e)=> setValue(e.target.value)}
                value={value} 
                placeholder="Search"
                 className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500" />
                {/* Todo: add remove button */}
                {/* <button type="button" onClick={handleRemove} className="absolute border-none  hover:border-gray-200 hover:bg-gray-200 rounded-full p-0  right-0 top-0 h-full    ">
                    <Plus className="size-10 rotate-45 -z-0" strokeWidth={0.5}/>
                </button> */}

                {value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={()=> setValue("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    >
                        <XIcon className="text-gray-500"/>
                    </Button>
                )}

            </div>
            <button 
                disabled={!value.trim()}
                type="submit" 
                className="bg-gray-100 px-5 py-2.5 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                <SearchIcon className="size-5"/>
            </button>
        </form>
    );
}
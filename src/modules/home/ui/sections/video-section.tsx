"use client";

import { trpc } from "@/trpc/client";

interface VideoSectionProps {
    categoryId?: string;
}

export const VideoSection = ({ categoryId }: VideoSectionProps) => {
    const [categories] = trpc.categories.getMany.useSuspenseQuery();
    return (
        <div className="flex flex-col gap-y-4">
            {categories.map((category) => (
                <div key={category.id} className="flex flex-col gap-y-2">
                    <p className="text-lg font-bold">{category.name}</p>
                    <p>{category.description}</p>
                </div>
            ))}
        </div>
    );
}
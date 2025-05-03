import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container py-12">
            <div className="mb-6 h-10 w-32">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="aspect-video w-full rounded-lg" />

                    <div className="mt-6">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="mt-2 h-10 w-3/4" />
                    </div>

                    <div className="mt-8">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="mt-6 h-[400px] w-full rounded-lg" />
                    </div>
                </div>

                <div>
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                    <Skeleton className="mt-6 h-[200px] w-full rounded-lg" />
                </div>
            </div>

            <div className="mt-16">
                <Skeleton className="mb-6 h-8 w-48" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="aspect-[4/3] w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    )
}

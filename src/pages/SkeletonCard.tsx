import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <main className="mt-12">
      <div>
        <div className="flex w-full flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-7">
          <Skeleton className="h-6 w-1/3 flex-grow" />
          <Skeleton className="h-4 w-1/2 " />
        </div>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-5 px-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="bg-white rounded-lg border border-[#D9D9D9] p-3 sm:py-5 sm:px-7 flex flex-col gap-1 sm:gap-2.5"
            >
              <Skeleton className="h-3 w-1/3 mb-2" />
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/4 mb-2" />
            </div>
          ))}
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-5 mt-5">
          <div className="bg-green-300 border-[#D9D9D9] rounded-xl px-4 sm:px-8 py-6 mx-2 font-Inter">
            <div className="flex gap-2 px-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-2 flex-grow" />
            </div>

            <Skeleton className="h-60 w-full mb-2 bg-white border-[#D9D9D9] rounded-xl " />
          </div>

          <div className="bg-stone-700 border-[#D9D9D9] p-4 sm:px-8 sm:py-6 mx-2 rounded-lg ">
            <Skeleton className="h-4 w-1/4 my-4" />
            <div>
              <div className="mt-5 sm:mt-8">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
              </div>
              <Skeleton className="h-6 w-1/4 mt-5" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#D9D9D9] p-4 sm:p-8 mt-5 mx-2 rounded-[8px] font-Inter">
          <Skeleton className="h-3 w-1/2 mt-4" />
          <div className="mt-5 sm:mt-8 border border-gray-300 rounded-t-xl">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoadingSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-24">
                        <div className="h-3 bg-slate-200 rounded w-1/2 mb-3" />
                        <div className="h-6 bg-slate-200 rounded w-1/3" />
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-4" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded mb-2" />
                ))}
            </div>
        </div>
    );
}

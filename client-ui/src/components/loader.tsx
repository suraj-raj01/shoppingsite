export default function Loader() {
    return (
        <section className="fixed inset-0 z-9999 flex items-center justify-center bg-background">
            {/* Background Blur */}
            <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/40" />

            <div className="relative flex flex-col items-center">
                {/* Spinner */}
                <div className="relative flex h-36 w-36 items-center justify-center">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />

                    {/* Animated Ring */}
                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary animate-spin" />

                    {/* Inner Ring */}
                    <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-primary/60 animate-[spin_3s_linear_reverse_infinite]" />

                    {/* Logo */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/40">
                        <span className="text-4xl font-bold text-primary-foreground animate-pulse">
                            S
                        </span>
                    </div>
                </div>

                {/* Brand */}
                <div className="mt-8 text-center">
                    <h1 className="text-3xl font-bold tracking-wide">
                        Shopping Site
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Preparing your experience
                    </p>

                    {/* Animated Dots */}
                    <div className="mt-5 flex justify-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>
            </div>
        </section>
    );
}
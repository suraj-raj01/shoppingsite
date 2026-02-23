
const categories = [
    "All",
    "Electronics",
    "Grossory",
    "Plants",
    "Food",
    "Vehicles"
]

export default function Categories() {
    return (
        <div className="flex items-center h-8 justify-start text-muted-foreground gap-2 md:px-10">
            {
                categories.map((item, index) => {
                    return (
                        <div key={index} className="p-1 font-semibold cursor-pointer text-sm lg:text:md hover:bg-muted">
                            {item}
                        </div>
                    )
                })
            }
        </div>
    )
}

const data = [
    {
        id: 1,
        title: "Notification 1",
        description: "Description 1",
        date: "2022-01-01",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 2,
        title: "Notification 2",
        description: "Description 2",
        date: "2022-01-02",
        time: "12:00 AM",
        read: true,
    },
    {
        id: 3,
        title: "Notification 3",
        description: "Description 3",
        date: "2022-01-03",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 4,
        title: "Notification 4",
        description: "Description 4",
        date: "2022-01-04",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 5,
        title: "Notification 5",
        description: "Description 5",
        date: "2022-01-05",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 6,
        title: "Notification 6",
        description: "Description 6",
        date: "2022-01-06",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 7,
        title: "Notification 7",
        description: "Description 7",
        date: "2022-01-07",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 8,
        title: "Notification 8",
        description: "Description 8",
        date: "2022-01-08",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 9,
        title: "Notification 9",
        description: "Description 9",
        date: "2022-01-09",
        time: "12:00 AM",
        read: false,
    },
    {
        id: 10,
        title: "Notification 10",
        description: "Description 10",
        date: "2022-01-10",
        time: "12:00 AM",
        read: false,
    },
]

export default function Notification(){
    return(
        <section className="p-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="w-full gap-2 grid grid-cols-1 md:grid-cols-3">
                {data.map((item) => (
                    <div key={item.id} className="flex rounded-xs border hover:bg-green-100 border-green-200 mb-1 px-5 py-2 cursor-pointer items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm">{item.description}</p>
                        </div>
                        <p className="text-sm">{item.date} {item.time}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
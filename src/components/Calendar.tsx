import React, { useState } from "react";

interface Note {
    date: string;
    title: string;
}

const Calendar: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [notes, setNotes] = useState<Record<string, Note[]>>({});
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [noteTitle, setNoteTitle] = useState("");

    const getFirstDayOfMonth = (date: Date): Date =>
        new Date(date.getFullYear(), date.getMonth(), 1);

    const getLastDayOfMonth = (date: Date): Date =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const getDayNames = (): string[] => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const getDaysInMonth = (date: Date): number =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const getFormattedDate = (date: Date): string =>
        `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}`;

    const openModal = (note: Note | null = null) => {
        setShowModal(true);
        setEditingNote(note);
        setNoteTitle(note?.title || "");
        setNoteDate(note?.date || getFormattedDate(selectedDate));
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingNote(null);
        setNoteTitle("");
        setNoteDate(getFormattedDate(selectedDate));
    };
    const [noteDate, setNoteDate] = useState(getFormattedDate(new Date()));

    const saveNote = () => {
        const updatedNotes = { ...notes };
        if (editingNote) {
            const oldDate = editingNote.date;
            updatedNotes[oldDate] = updatedNotes[oldDate]?.filter((note) => note !== editingNote) || [];
            if (!updatedNotes[noteDate]) updatedNotes[noteDate] = [];
            updatedNotes[noteDate].push({ date: noteDate, title: noteTitle });
        } else {
            if (!updatedNotes[noteDate]) updatedNotes[noteDate] = [];
            updatedNotes[noteDate].push({ date: noteDate, title: noteTitle });
        }
        setNotes(updatedNotes);
        closeModal();
    };

    const handleMonthChange = (increment: number) => {
        const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + increment));
        setCurrentMonth(newMonth);
    };

    const renderHeader = () => (
        <div className="justify-between flex items-center p-4  text-white rounded-md mb-4">
              <h2 className="text-lg text-black font-semibold">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <div>
            <button onClick={() => handleMonthChange(-1)}  className="text-xl font-bold text-black hover:text-blue-300 mr-6">
                &lt;
            </button>
        
            <button onClick={() => handleMonthChange(1)} className="text-xl font-bold text-black hover:text-blue-300"  >
                &gt;
            </button>
            </div>
        </div>
    );

    const renderDays = () => (
        <div className="grid grid-cols-7 border-b pb-2 ">
            {getDayNames().map((day) => (
                <div key={day} className="text-center font-medium uppercase  gap-1 text-gray-700">
                    {day}
                </div>
            ))}
        </div>
    );

    const renderCells = () => {
        const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
        const lastDayOfMonth = getLastDayOfMonth(currentMonth);
        const daysInMonth = getDaysInMonth(currentMonth);
        console.log(lastDayOfMonth);
        const startDay = (firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1);
        const rows = [];
        let cells: JSX.Element[] = [];
        for (let i = 0; i < startDay; i++) {
            cells.push(<div key={`empty-${i}`} className="p-2 w-24 h-24"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const formattedDate = getFormattedDate(date);

            cells.push(
                <div
                    key={day}
                    className={`p-2 w-24 h-24 border flex flex-col justify-between ${formattedDate === getFormattedDate(selectedDate) ? "bg-blue-200" : "bg-white"
                        } hover:bg-blue-100 rounded-md`}
                    onClick={() => setSelectedDate(date)}
                >
                    <div className="text-sm">{day}</div>
                    {notes[formattedDate]?.map((note, idx) => (
                        <div key={idx} className="text-xs bg-blue-200 p-1 rounded mt-1">
                            <span>{note.title}</span>
                        </div>
                    ))}
                </div>
            );

            if ((day + startDay) % 7 === 0 || day === daysInMonth) {
                rows.push(
                    <div key={day} className="grid grid-cols-7 gap-1">
                        {cells}
                    </div>
                );
                cells = [];
            }
        }

        return <div>{rows}</div>;
    };
    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-md">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500" onClick={() => openModal()}>Add Event</button>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">
                            {editingNote ? "Edit Event" : "Add New Event"}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Date</label>
                            <input type="date" className="border p-2 w-full rounded-md" value={noteDate}  onChange={(e) => setNoteDate(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Title</label>
                            <input type="text" className="border p-2 w-full rounded-md" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"  onClick={closeModal}>Cancel</button>
                            <button  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500" onClick={saveNote} > Save Event </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;

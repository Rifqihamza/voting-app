"use client"

import { Election } from "@/generated/prisma"
import { useState, useEffect } from "react"

export default function ElectionDashboard() {
    const [elections, setElections] = useState<Election[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startAt, setStartAt] = useState("")
    const [endAt, setEndAt] = useState("")
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
    const [electionAction, setElectionAction] = useState<"start" | "reset" | null>(null)
    const [selectedElectionId, setSelectedElectionId] = useState<number | null>(null)

    // Fetch all elections
    const fetchElections = async () => {
        try {
            setLoading(true)
            const res = await fetch("/api/election")
            if (!res.ok) throw new Error("Failed to fetch elections")
            const data = await res.json()
            setElections(data)
        } catch (err) {
            console.error(err)
            setError("Failed to fetch elections")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchElections()
    }, [])

    // Handle Add New Election
    const handleAddElection = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        try {
            const res = await fetch("/api/election", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    startAt: new Date(startAt),
                    endAt: new Date(endAt),
                }),
            })
            setDescription("")
            setStartAt("")
            setEndAt("")
            if (!res.ok) throw new Error("Failed to create election")
            setTitle("")
            fetchElections()
        } catch (err) {
            console.error(err)
            alert("Error creating election")
        }
    }

    // Start / Reset handlers
    const handleAction = async (action: "start" | "reset", id: number) => {
        setElectionAction(action)
        setSelectedElectionId(id)
        setIsConfirmationModalOpen(true)
    }

    const confirmAction = async () => {
        setIsConfirmationModalOpen(false)
        if (!electionAction || !selectedElectionId) return

        try {
            const response = await fetch(`/api/election/${electionAction}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedElectionId }),
            })

            if (!response.ok) throw new Error(`Failed to ${electionAction} election`)
            setIsSuccessModalOpen(true)
            fetchElections()
        } catch (error) {
            console.error(`Error ${electionAction}ing election:`, error)
            setIsErrorModalOpen(true)
        }
    }

    // UI State
    if (loading) return <p className="text-center mt-10">Loading...</p>
    if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>

    return (
        <section className="w-full max-w-6xl mx-auto p-6 space-y-10">
            <h1 className="text-3xl font-bold text-violet-600">
                Election Dashboard
            </h1>

            {/* --- Add Election Form --- */}
            <form
                onSubmit={handleAddElection}
                className="card shadow-md p-6 rounded-2xl space-y-4 bg-white"
            >
                <h2 className="text-xl font-semibold">Add New Election</h2>
                <label htmlFor="title">Election Title</label>
                <input
                    type="text"
                    placeholder="Election title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input border border-gray-200 w-full bg-white outline-none"
                />
                <label htmlFor="description">Election Description</label>
                <input
                    type="text"
                    placeholder="Election Description"
                    value={description} // Fix: Use description state
                    onChange={(e) => setDescription(e.target.value)} // Fix: Update description state
                    className="input border border-gray-200 w-full bg-white outline-none"
                />
                <label htmlFor="startAt">Start Time</label>
                <input
                    type="datetime-local"
                    placeholder="Start Time" // Fix: Change placeholder
                    value={startAt} // Fix: Use startAt state
                    onChange={(e) => setStartAt(e.target.value)} // Fix: Update startAt state
                    className="input border border-gray-200 w-full bg-white outline-none"
                />
                <label htmlFor="endAt">End Time</label>
                <input
                    type="datetime-local"
                    placeholder="End Time" // Fix: Change placeholder
                    value={endAt} // Fix: Use endAt state
                    onChange={(e) => setEndAt(e.target.value)} // Fix: Update endAt state
                    className="input border border-gray-200 w-full bg-white outline-none"
                />
                <button type="submit" className="btn btn-primary w-full">
                    {loading ? <span className="loading loading-spinner loading-sm"></span> : "Add Election"}
                </button>
            </form>

            {/* --- Election List --- */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-2">All Elections</h2>
                {elections.length === 0 ? (
                    <p>No elections available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {elections.map((election) => (
                            <div
                                key={election.id}
                                className="card bg-white border border-gray-200 shadow-sm p-4"
                            >
                                <h3 className="text-lg font-semibold">{election.title}</h3>
                                <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    {election.isPublished ? (
                                        <span className="text-green-500">Published</span>
                                    ) : (
                                        <span className="text-gray-500">Unpublished</span>
                                    )}
                                </p>
                                <p className="text-sm">
                                    Created: {new Date(election.createdAt).toLocaleString()}
                                </p>
                                <p className="text-sm">
                                    Updated: {new Date(election.updatedAt).toLocaleString()}
                                </p>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        className="btn btn-success btn-sm"
                                        disabled={election.isPublished}
                                        onClick={() => handleAction("start", election.id)}
                                    >
                                        Start
                                    </button>
                                    <button
                                        className="btn btn-error btn-sm"
                                        onClick={() => handleAction("reset", election.id)}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Confirmation Modal --- */}
            {isConfirmationModalOpen && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-lg">Confirm Action</h3>
                        <p className="py-4">
                            Are you sure you want to{" "}
                            <strong>{electionAction}</strong> this election?
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-outline"
                                onClick={() => setIsConfirmationModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={confirmAction}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* --- Success Modal --- */}
            {isSuccessModalOpen && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-lg">Success!</h3>
                        <p className="py-4">
                            Election has been successfully {electionAction}ed.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setIsSuccessModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* --- Error Modal --- */}
            {isErrorModalOpen && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-lg text-error">Error!</h3>
                        <p className="py-4">
                            Failed to {electionAction} the election. Please try again later.
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setIsErrorModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </section>
    )
}

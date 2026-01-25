"use client"

import { useState } from "react"
import { useElection } from "@/hook/useElection"

export default function ElectionDashboard() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const {
        elections,
        loading,
        error,
        createElection,
        updateElection,
        deleteElection,
        actionElection,
    } = useElection()

    type FormFields = {
        title: string
        description: string
        startAt: string
        endAt: string
        isPublished: boolean
    }

    const [form, setForm] = useState<FormFields>({
        title: "",
        description: "",
        startAt: "",
        endAt: "",
        isPublished: false,
    })

    const [editId, setEditId] = useState<number | null>(null)
    const [modal, setModal] = useState<{
        type: "confirm" | "success" | "error" | null
        action?: "start" | "reset" | "delete"
        id?: number
    }>({ type: null })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) return alert("Title is required")

        try {
            if (editId) {
                await updateElection(editId, form)
            } else {
                await createElection(form)
            }
            setForm({ title: "", description: "", startAt: "", endAt: "", isPublished: false })
            setEditId(null)
            setModal({ type: "success" })
        } catch {
            setModal({ type: "error" })
        }
    }

    const handleEdit = (id: number) => {
        const election = elections.find((e) => e.id === id)
        if (!election) return
        setForm({
            title: election.title,
            description: election.description || "",
            startAt: new Date(election.startAt).toISOString().slice(0, 16),
            endAt: new Date(election.endAt).toISOString().slice(0, 16),
            isPublished: election.isPublished,
        })
        setEditId(id)
        setIsEditModalOpen(true)
    }


    const confirmAction = async () => {
        if (!modal.id || !modal.action) return
        try {
            if (modal.action === "delete") {
                await deleteElection(modal.id)
            } else {
                await actionElection(modal.id, modal.action)
            }
            setModal({ type: "success" })
        } catch {
            setModal({ type: "error" })
        }
    }

    if (loading) return <p className="text-center mt-10">Loading...</p>
    if (error) return <p className="text-center text-red-500">{error}</p>

    return (
        <section className="w-full max-w-6xl mx-auto p-6 space-y-10">
            <h1 className="text-3xl font-bold text-violet-600">Election Dashboard</h1>

            {/* Add or Edit Election */}
            <form
                onSubmit={handleSubmit}
                className="card bg-white shadow-md p-6 rounded-2xl space-y-4"
            >
                <h2 className="text-xl font-semibold">
                    Add Election
                </h2>

                <div>
                    <label className="block">Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="input bg-white border border-gray-300 w-full"
                    />
                </div>

                <div>
                    <label className="block">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="textarea border bg-white border-gray-300 w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block">Start At</label>
                        <input
                            type="datetime-local"
                            value={form.startAt}
                            onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                            className="input border bg-white border-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block">End At</label>
                        <input
                            type="datetime-local"
                            value={form.endAt}
                            onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                            className="input border bg-white border-gray-300 w-full"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                        className="checkbox checkbox-primary"
                    />
                    <label>Published?</label>
                </div>

                <button type="submit" className="btn w-full">
                    Add Election
                </button>
            </form>

            {/* Elections List */}
            <div>
                <h2 className="text-xl font-semibold mb-2">All Elections</h2>
                {elections.length === 0 ? (
                    <p>No elections yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {elections.map((e) => (
                            <div
                                key={e.id}
                                className="card bg-white border border-gray-200 shadow-sm p-4"
                            >
                                <h3 className="font-semibold">{e.title}</h3>
                                <p>
                                    Status:{" "}
                                    {e.isPublished ? (
                                        <span className="text-green-500">Published</span>
                                    ) : (
                                        <span className="text-gray-500">Unpublished</span>
                                    )}
                                </p>
                                <p className="text-sm">
                                    Start: {new Date(e.startAt).toLocaleString()}
                                </p>
                                <p className="text-sm">
                                    End: {new Date(e.endAt).toLocaleString()}
                                </p>

                                <div className="flex gap-2 mt-3">
                                    <button
                                        className="btn btn-info btn-sm text-white"
                                        onClick={() =>
                                            setModal({
                                                type: "confirm",
                                                action: e.isPublished ? "reset" : "start",
                                                id: e.id,
                                            })
                                        }
                                    >
                                        {e.isPublished ? "Reset" : "Start"}
                                    </button>

                                    <button
                                        className="btn btn-warning btn-sm text-white"
                                        onClick={() => handleEdit(e.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-error btn-sm text-white"
                                        onClick={() =>
                                            setModal({ type: "confirm", action: "delete", id: e.id })
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Modals --- */}
            {isEditModalOpen && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-lg">Edit Election</h3>
                        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="input border bg-white border-gray-300 w-full"
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="textarea border bg-white border-gray-300 w-full"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="datetime-local"
                                    value={form.startAt}
                                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                                    className="input border bg-white border-gray-300 w-full"
                                />
                                <input
                                    type="datetime-local"
                                    value={form.endAt}
                                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                                    className="input border bg-white border-gray-300 w-full"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.isPublished}
                                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                                    className="checkbox checkbox-primary"
                                />
                                <label>Published?</label>
                            </div>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}

            {modal.type === "confirm" && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-lg">Confirm Action</h3>
                        <p className="py-4">
                            Are you sure you want to{" "}
                            <strong>{modal.action}</strong> this election?
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-outline"
                                onClick={() => setModal({ type: null })}
                            >
                                Cancel
                            </button>
                            <button className={`btn btn-${modal.action === "start" ? "success" : "error"} text-white`} onClick={confirmAction}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {modal.type === "success" && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-lg text-success">Success!</h3>
                        <p className="py-4">Election successfully processed.</p>
                        <div className="modal-action">
                            <button className="btn btn-success text-white rounded-lg" onClick={() => setModal({ type: null })}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {modal.type === "error" && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-white">
                        <h3 className="font-bold text-lg text-error">Error!</h3>
                        <p className="py-4">Something went wrong. Please try again.</p>
                        <div className="modal-action">
                            <button className="btn btn-error text-white rounded-lg" onClick={() => setModal({ type: null })}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </section>
    )
}

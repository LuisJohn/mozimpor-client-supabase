"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"
import { toast } from "react-toastify"

interface Feedback {
  id: string
  satisfaction: "happy" | "sad"
  name: string
  contact: string
  comment: string
  rating: number
  timestamp: string
}

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    const response = await fetch("/api/feedback")
    const data = await response.json()
    setFeedbacks(data.feedbacks)
  }

  const handleDeleteClick = (id: string) => {
    setFeedbackToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async (password: string) => {
    if (!feedbackToDelete) return

    try {
      const response = await fetch("/api/feedback", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: feedbackToDelete, password }),
      })

      if (response.ok) {
        toast.success("Feedback deleted successfully")
        fetchFeedbacks()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete feedback")
      }
    } catch (error) {
      console.error("Error deleting feedback:", error)
      toast.error("Error deleting feedback")
    }

    setIsDeleteModalOpen(false)
    setFeedbackToDelete(null)
  }

  const happyCount = feedbacks.filter((f) => f.satisfaction === "happy").length
  const sadCount = feedbacks.filter((f) => f.satisfaction === "sad").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Feedback Dashboard</h1>
          <Link href="/">
            <Button variant="outline" className="text-lg py-2 px-4">
              Back to Feedback Form
            </Button>
          </Link>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Feedback Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">Happy Clients</p>
                <p className="text-4xl text-green-600">{happyCount}</p>
              </div>
              <div>
                <p className="text-2xl font-bold">Sad Clients</p>
                <p className="text-4xl text-red-600">{sadCount}</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold">Total Feedbacks</p>
              <p className="text-4xl">{feedbacks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedbacks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{new Date(feedback.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{feedback.satisfaction === "happy" ? "😃" : "😞"}</TableCell>
                    <TableCell>{feedback.rating}</TableCell>
                    <TableCell>{feedback.name || "-"}</TableCell>
                    <TableCell>{feedback.contact || "-"}</TableCell>
                    <TableCell>{feedback.comment || "-"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(feedback.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

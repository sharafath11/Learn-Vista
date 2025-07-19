"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/shared/components/ui/dialog"
import { Button } from "@/src/components/shared/components/ui/button"
import { Textarea } from "@/src/components/shared/components/ui/textarea"
import { Input } from "@/src/components/shared/components/ui/input"
import { useState, useRef, type ChangeEvent } from "react"
import { MessageCircleWarning, Upload, X, ImageIcon, Mic, Loader2 } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast"
import type { ConcernDialogProps, sendAttachement } from "@/src/types/concernTypes"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { useMentorContext } from "@/src/context/mentorContext"

export function RaiseConcernDialog({ courseId, onSuccess }: ConcernDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<sendAttachement[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { concerns,setConcerns } = useMentorContext()
  const concern = concerns.find((i) => i.courseId === courseId)
  const status = concern?.status

  const isModalAllowed = status !== "open" && status !== "in-progress"

  const getStatusButtonClass = () => {
    if (status === "open") return "border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
    if (status === "in-progress") return "border-orange-500 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
    if (status === "resolved") return "border-green-500 text-green-400 hover:bg-green-500/10 hover:text-green-300"
    return "border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const updated: sendAttachement[] = []

    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
      })

    for (const file of Array.from(files)) {
      const type = file.type.startsWith("image") ? "image" : "audio"

      if (file.size > 10 * 1024 * 1024) {
        showErrorToast(`${file.name} exceeds 10MB limit`)
        continue
      }

      const base64 = await toBase64(file)

      updated.push({
        id: crypto.randomUUID(),
        file: base64,
        name: file.name,
        size: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        type,
      })
    }

    setAttachments((prev) => [...prev, ...updated])
    e.target.value = ""
  }

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      showErrorToast("Please enter a title for your concern")
      return
    }
    if (!message.trim()) {
      showErrorToast("Please describe your concern")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.set("title", title)
    formData.set("message", message)
    formData.set("courseId", courseId)
    attachments.forEach((att) => {
      formData.append("attachments", att.file)
    })

    const res = await MentorAPIMethods.riseConcern(formData)
    setIsSubmitting(false)

    if (!res.ok) {
      showErrorToast(res.msg)
      return
    }

    showSuccessToast("Concern submitted successfully")
    setTitle("")
    setMessage("")
    setAttachments([])
    setOpen(false)
    onSuccess?.()
  }

  const getAttachmentIcon = (type: "image" | "audio") => {
    return type === "image" ? (
      <ImageIcon className="w-4 h-4 text-blue-400" />
    ) : (
      <Mic className="w-4 h-4 text-purple-400" />
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="space-y-2">
        {isModalAllowed ? (
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`${getStatusButtonClass()} shadow-md rounded-full px-3 py-1.5 flex items-center gap-1.5 transition-all bg-transparent text-sm`}
            >
              <MessageCircleWarning size={16} />
              {status === "resolved" || !status ? "Raise Concern" : `Concern: ${status}`}
            </Button>
          </DialogTrigger>
        ) : (
          <Button
            variant="outline"
            disabled
            className={`${getStatusButtonClass()} opacity-70 cursor-not-allowed bg-transparent shadow-md rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm`}
          >
            <MessageCircleWarning size={16} />
            Concern: {status}
          </Button>
        )}
      </div>

      <DialogContent className="bg-gray-900 border border-yellow-700 shadow-2xl rounded-xl max-w-md sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-yellow-400 text-2xl font-bold">
            Report a Concern
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Please fill in the title and describe your issue. You can also attach files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Enter a short title for your concern..."
            className="bg-gray-800 text-gray-200 border border-gray-600 placeholder:text-gray-500 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Describe your concern in detail..."
            rows={5}
            className="bg-gray-800 text-gray-200 border border-gray-600 placeholder:text-gray-500 rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="space-y-2">
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,audio/*"
                onChange={handleFileChange}
              />
              <Upload className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-gray-300">Click to upload files or drag and drop</p>
              <p className="text-sm text-gray-500">Images, Audio (Max 10MB each)</p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Attachments ({attachments.length})</p>
                <div className="space-y-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getAttachmentIcon(att.type)}
                        <div>
                          <p className="text-gray-200 text-sm font-medium truncate w-44">
                            {att.name}
                          </p>
                          <p className="text-gray-400 text-xs">{att.size} MB</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(att.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false)
              setTitle("")
              setMessage("")
              setAttachments([])
            }}
            className="text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !message.trim()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1">
                <Loader2 className="animate-spin w-4 h-4" />
                Submitting...
              </span>
            ) : (
              "Submit Concern"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

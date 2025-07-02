// "use client"

// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { useState, useEffect } from "react"
// import { AlertCircle, Clock, CheckCircle, Eye, Calendar, ImageIcon, Music, FileText, Download, XCircle, Filter, Search, ChevronDown } from 'lucide-react'
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Input } from "@/components/ui/input"
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// // Types
// type ConcernStatus = "pending" | "resolved" | "in_progress" | "escalated"
// type ConcernPriority = "high" | "medium" | "low"

// interface Concern {
//   id: string
//   message: string
//   attachments?: { filename: string; url: string; type: string }[]
//   status: ConcernStatus
//   createdAt: string
//   priority: ConcernPriority
//   resolution?: string
// }

// interface ViewConcernsDialogProps {
//   courseId?: string
// }


// export function ViewConcernsDialog({ courseId }: ViewConcernsDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [concerns, setConcerns] = useState<Concern[]>([])
//   const [filteredConcerns, setFilteredConcerns] = useState<Concern[]>([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<ConcernStatus | "all">("all")
//   const [priorityFilter, setPriorityFilter] = useState<ConcernPriority | "all">("all")

//   const getStatusDisplay = (status: ConcernStatus) => {
//     const configs = {
//       resolved: {
//         icon: <CheckCircle className="w-4 h-4" />,
//         colorClasses: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 shadow-emerald-500/10",
//         label: "Resolved"
//       },
//       pending: {
//         icon: <Clock className="w-4 h-4" />,
//         colorClasses: "bg-amber-500/15 text-amber-400 border-amber-500/25 shadow-amber-500/10",
//         label: "Pending"
//       },
//       in_progress: {
//         icon: <Eye className="w-4 h-4" />,
//         colorClasses: "bg-blue-500/15 text-blue-400 border-blue-500/25 shadow-blue-500/10",
//         label: "In Progress"
//       },
//       escalated: {
//         icon: <AlertCircle className="w-4 h-4" />,
//         colorClasses: "bg-red-500/15 text-red-400 border-red-500/25 shadow-red-500/10",
//         label: "Escalated"
//       }
//     }
//     return configs[status] || configs.pending
//   }

//   const getPriorityDisplay = (priority: ConcernPriority) => {
//     const configs = {
//       high: {
//         colorClasses: "bg-red-500/15 text-red-400 border-red-500/25 shadow-red-500/10",
//         label: "High Priority"
//       },
//       medium: {
//         colorClasses: "bg-orange-500/15 text-orange-400 border-orange-500/25 shadow-orange-500/10",
//         label: "Medium Priority"
//       },
//       low: {
//         colorClasses: "bg-green-500/15 text-green-400 border-green-500/25 shadow-green-500/10",
//         label: "Low Priority"
//       }
//     }
//     return configs[priority] || configs.medium
//   }

//   const getAttachmentIcon = (type: string) => {
//     const iconClass = "w-4 h-4"
//     switch (type) {
//       case "image":
//         return <ImageIcon className={`${iconClass} text-blue-400`} />
//       case "audio":
//         return <Music className={`${iconClass} text-purple-400`} />
//       case "document":
//         return <FileText className={`${iconClass} text-green-400`} />
//       default:
//         return <FileText className={`${iconClass} text-gray-400`} />
//     }
//   }

 

//   useEffect(() => {
//     if (open) {
//       fetchConcernsData()
//     }
//   }, [open, courseId])

//   useEffect(() => {
//     let filtered = concerns

//     // Apply search filter
//     if (searchTerm) {
//       filtered = filtered.filter(concern =>
//         concern.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         concern.resolution?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     }

//     // Apply status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(concern => concern.status === statusFilter)
//     }

//     // Apply priority filter
//     if (priorityFilter !== "all") {
//       filtered = filtered.filter(concern => concern.priority === priorityFilter)
//     }

//     setFilteredConcerns(filtered)
//   }, [concerns, searchTerm, statusFilter, priorityFilter])

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "N/A"
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     } catch (error) {
//       console.error("Error formatting date:", dateString, error)
//       return "Invalid Date"
//     }
//   }

//   const getStatusCounts = () => {
//     return {
//       all: concerns.length,
//       pending: concerns.filter(c => c.status === "pending").length,
//       resolved: concerns.filter(c => c.status === "resolved").length,
//       in_progress: concerns.filter(c => c.status === "in_progress").length,
//       escalated: concerns.filter(c => c.status === "escalated").length,
//     }
//   }

//   const statusCounts = getStatusCounts()

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
      

//       <DialogContent className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-orange-700/50 rounded-2xl max-w-6xl max-h-[90vh] flex flex-col shadow-2xl backdrop-blur-sm">
//         <DialogHeader className="space-y-4 pb-2">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <DialogTitle className="text-orange-400 text-2xl sm:text-3xl font-bold flex items-center gap-3">
//                 <div className="p-2 bg-orange-500/20 rounded-xl">
//                   <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
//                 </div>
//                 <div>
//                   <span>Course Concerns</span>
//                   <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 ml-3 px-2 py-1">
//                     {concerns.length} Total
//                   </Badge>
//                 </div>
//               </DialogTitle>
//               <DialogDescription className="text-gray-400 text-base mt-2">
//                 Track, manage, and resolve all concerns raised for this course
//               </DialogDescription>
//             </div>
//           </div>

//           {/* Enhanced Filters Section */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-2">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Search concerns..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 bg-gray-800/50 border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20"
//               />
//             </div>
            
//             <div className="flex gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50">
//                     <Filter className="w-4 h-4 mr-2" />
//                     Status
//                     <ChevronDown className="w-4 h-4 ml-2" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="bg-gray-800 border-gray-600">
//                   <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-gray-300 hover:bg-gray-700">
//                     All ({statusCounts.all})
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setStatusFilter("pending")} className="text-amber-400 hover:bg-gray-700">
//                     Pending ({statusCounts.pending})
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setStatusFilter("in_progress")} className="text-blue-400 hover:bg-gray-700">
//                     In Progress ({statusCounts.in_progress})
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setStatusFilter("resolved")} className="text-emerald-400 hover:bg-gray-700">
//                     Resolved ({statusCounts.resolved})
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setStatusFilter("escalated")} className="text-red-400 hover:bg-gray-700">
//                     Escalated ({statusCounts.escalated})
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50">
//                     Priority
//                     <ChevronDown className="w-4 h-4 ml-2" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="bg-gray-800 border-gray-600">
//                   <DropdownMenuItem onClick={() => setPriorityFilter("all")} className="text-gray-300 hover:bg-gray-700">
//                     All Priorities
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setPriorityFilter("high")} className="text-red-400 hover:bg-gray-700">
//                     High Priority
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setPriorityFilter("medium")} className="text-orange-400 hover:bg-gray-700">
//                     Medium Priority
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setPriorityFilter("low")} className="text-green-400 hover:bg-gray-700">
//                     Low Priority
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Enhanced Content Area */}
//         <div className="flex-1 overflow-hidden">
//           <div className="h-full overflow-y-auto px-1 space-y-4 pb-4">
//             {filteredConcerns.length === 0 ? (
//               <Card className="bg-gradient-to-br from-gray-800/40 to-gray-800/20 border-gray-700/50 shadow-xl">
//                 <CardContent className="flex flex-col items-center justify-center py-16 px-6">
//                   <div className="p-4 bg-gray-700/30 rounded-full mb-6">
//                     <AlertCircle className="w-12 h-12 text-gray-500" />
//                   </div>
//                   <h3 className="text-gray-300 text-xl font-semibold mb-2">
//                     {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
//                       ? "No matching concerns found" 
//                       : "No concerns raised yet"
//                     }
//                   </h3>
//                   <p className="text-gray-500 text-center max-w-md">
//                     {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
//                       ? "Try adjusting your search or filter criteria to find what you're looking for."
//                       : "When concerns are submitted, they will appear here for tracking and resolution."
//                     }
//                   </p>
//                   {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
//                     <Button 
//                       variant="outline" 
//                       onClick={() => {
//                         setSearchTerm("")
//                         setStatusFilter("all")
//                         setPriorityFilter("all")
//                       }}
//                       className="mt-4 border-gray-600 text-gray-400 hover:bg-gray-700/50"
//                     >
//                       Clear Filters
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             ) : (
//               <div className="grid gap-4">
//                 {filteredConcerns.map((concern) => {
//                   const statusDisplay = getStatusDisplay(concern.status)
//                   const priorityDisplay = getPriorityDisplay(concern.priority)

//                   return (
//                     <Card
//                       key={concern.id}
//                       className="bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-800/30 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
//                     >
//                       <CardHeader className="pb-4">
//                         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//                           <div className="flex-1 space-y-3">
//                             <div className="flex flex-wrap items-center gap-2">
//                               <Badge className={`${statusDisplay.colorClasses} border px-3 py-1.5 text-xs font-semibold shadow-sm`}>
//                                 <div className="flex items-center gap-1.5">
//                                   {statusDisplay.icon}
//                                   {statusDisplay.label}
//                                 </div>
//                               </Badge>
//                               <Badge className={`${priorityDisplay.colorClasses} border px-3 py-1.5 text-xs font-semibold shadow-sm`}>
//                                 {priorityDisplay.label}
//                               </Badge>
//                             </div>
//                             <div className="flex items-center gap-2 text-sm text-gray-400">
//                               <Calendar className="w-4 h-4" />
//                               <span>{formatDate(concern.createdAt)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="pt-0 space-y-4">
//                         <div className="prose prose-sm max-w-none">
//                           <p className="text-gray-200 leading-relaxed text-base">{concern.message}</p>
//                         </div>

//                         {concern.resolution && (
//                           <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-4 shadow-inner">
//                             <div className="flex items-center gap-2 mb-2">
//                               <CheckCircle className="w-5 h-5 text-emerald-400" />
//                               <span className="text-emerald-400 font-semibold text-sm">Resolution</span>
//                             </div>
//                             <p className="text-gray-300 leading-relaxed">{concern.resolution}</p>
//                           </div>
//                         )}

//                         {concern.attachments && concern.attachments.length > 0 && (
//                           <div className="space-y-3">
//                             <Separator className="bg-gray-700/50" />
//                             <div>
//                               <div className="flex items-center gap-2 mb-3">
//                                 <FileText className="w-4 h-4 text-gray-400" />
//                                 <span className="text-gray-400 text-sm font-medium">
//                                   Attachments ({concern.attachments.length})
//                                 </span>
//                               </div>
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                 {concern.attachments.map((att, j) => (
//                                   <div
//                                     key={j}
//                                     className="flex items-center justify-between bg-gray-800/60 p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/70 transition-all duration-200 group"
//                                   >
//                                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                                       <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-gray-700/70 transition-colors">
//                                         {getAttachmentIcon(att.type)}
//                                       </div>
//                                       <div className="min-w-0 flex-1">
//                                         <p className="text-gray-200 text-sm font-medium truncate">{att.filename}</p>
//                                         <p className="text-gray-500 text-xs capitalize">{att.type} file</p>
//                                       </div>
//                                     </div>
//                                     {att.url && att.url !== "#" ? (
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-2 rounded-lg transition-all"
//                                         onClick={() => window.open(att.url, "_blank")}
//                                       >
//                                         <Download className="w-4 h-4" />
//                                       </Button>
//                                     ) : (
//                                       <div className="text-red-400 text-xs flex items-center gap-1 px-2">
//                                         <XCircle className="w-3 h-3" />
//                                         <span className="hidden sm:inline">Unavailable</span>
//                                       </div>
//                                     )}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         <DialogFooter className="pt-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             <div className="text-xs text-gray-500 flex items-center gap-4">
//               <span>Showing {filteredConcerns.length} of {concerns.length} concerns</span>
//             </div>
//             <Button 
//               variant="ghost" 
//               onClick={() => setOpen(false)} 
//               className="text-gray-300 hover:bg-gray-700/50 px-6"
//             >
//               Close
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
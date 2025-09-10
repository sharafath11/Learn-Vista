import { UseFormReturn } from "react-hook-form";
import { CourseFormValues } from "../components/admin/course/course-form/schema";
import { IMentor } from "./mentorTypes";
import { IDonation } from "./donationTyps";
import { FilterOptions } from "./adminTypes";
import { IUser } from "./userTypes";
import { ICertificate } from "./certificateTypes";
import { JSX } from "react";

export interface IBasicInfoSectionProps {
  form: UseFormReturn<CourseFormValues>
}
export interface IDetailsSectionProps {
  form: UseFormReturn<CourseFormValues>
  tags: string[]
  tagInput: string
  setTagInput: (value: string) => void
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  removeTag: (tag: string) => void
}

export interface IFormActionsProps {
  isLoading: boolean
  onCancel: () => void
}
export interface IAdminCourseFormProps {
  courseId?: string
}
export interface IAdminMediaSectionProps {
  thumbnailPreview: string | null
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeThumbnail: () => void
}
export interface IAdminScheduleSectionProps {
  form: UseFormReturn<CourseFormValues>
}
export interface IAdminCourseAdditionalDetailsProps {
  formData: {
    language: string
    tags: string[]
    currentTag: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  languages: string[]
  handleAddTag: () => void
  handleRemoveTag: (tagToRemove: string) => void
}
export interface IAdminCourseBasicInfoProps {
  formData: {
    title: string
    description: string
    mentorId: string
    categoryId: string
   
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (name: string, value: string) => void
  mentors: Array<{ id: string; username: string; expertise: string[] }>
  categories: Array<{ id: string; title: string }>
}
export interface IAdminCourseScheduleProps {
  formData: {
    startDate: string
    endDate: string
    startTime: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export interface IAdminCourseThumbnailProps {
  thumbnailPreview: string | null
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearThumbnail: () => void
}

export interface IAdminMentorInfoCardProps {
  mentor: IMentor;
}
export interface IAdminMentorListProps {
  mentors: IMentor[];
}
export interface IAdminMentorRowProps {
  mentor: IMentor;
  theme: string;
  getStatusColor: (status: string) => string;
}
export interface IAdminMentorTableProps {
  theme: string;
}
export interface IAdminTransactionChartProps {
  transactions: IDonation[]
  loading: boolean
  filters: FilterOptions
}
export interface IAdminTransactionFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
  loading: boolean
  analyticsMode?: boolean
}
export interface IAdminTransactionStatsProps {
  transactions: IDonation[]
  loading: boolean
}
export interface IAdminTransactionTableProps {
  transactions: IDonation[]
  loading: boolean
  totalCount: number
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
}
export interface IAdminUserDetailsModalProps {
  user: IUser | null
  certificates: ICertificate[]
  isOpen: boolean
  onClose: () => void
}
export interface IAdminNavItem {
  name: string
  path: string
  icon: JSX.Element
}


export interface ICategory {
    id: string;
    title: string;
    description: string;
    isBlock: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
  
export interface IAdminCategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  categoryId?: string | null
}
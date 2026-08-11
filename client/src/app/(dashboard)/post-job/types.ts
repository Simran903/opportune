export interface FormData {
  title: string;
  description: string;
  location: string;
  company: string;
}

export interface DraftJob extends FormData {
  id: string;
  savedAt: string;
  lastUpdated: string;
  progress: number;
  name?: string;
}

export const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  location: "",
  company: "",
};
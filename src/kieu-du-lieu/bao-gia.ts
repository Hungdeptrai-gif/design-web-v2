export interface QuoteLead {
  id: string;
  code?: string;
  name: string;
  phone: string;
  email?: string;
  category: string;
  note: string;
  createdAt: string;
  status?: "pending" | "contacted";
}

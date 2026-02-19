
export interface Role {
  id: number;
  name: string;
  permissions: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    invite: boolean;
  };
}

export interface WizardData {
  roles: Role[];
  pages: {
    public: string[];
    private: string[];
  };
  uploads: {
    allowedTypes: string;
    maxSize: number;
  };
  auth: string[];
  brand: File | null;
  apis: string;
}

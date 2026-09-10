export type ValidationStatus = 'pending' | 'confirmed';

export interface ValidatedField<T> {
  status: ValidationStatus;
  value: T | null;
}

const pendingField = (): ValidatedField<string> => ({ status: 'pending', value: null });

export const business = {
  name: 'Bionatura',
  whatsapp: pendingField(),
  phone: pendingField(),
  email: pendingField(),
  pickup: pendingField(),
} satisfies Record<string, string | ValidatedField<string>>;

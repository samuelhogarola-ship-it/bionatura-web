export type ValidationStatus = 'pending' | 'confirmed';

export interface ValidatedField<T> {
  status: ValidationStatus;
  value: T | null;
}

const pendingField = (): ValidatedField<string> => ({ status: 'pending', value: null });

export const business = {
  name: 'Bionatura',
  legalName: 'Bionatura del Sur S.L.',
  taxId: 'B92371301',
  registeredAddress: {
    status: 'confirmed',
    value: { street: 'Calle Tórtolas, 11', postalCode: '29640', locality: 'Fuengirola', country: 'ES' },
  },
  whatsapp: pendingField(),
  phone: pendingField(),
  email: pendingField(),
  pickup: pendingField(),
};

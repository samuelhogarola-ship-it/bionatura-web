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
  whatsapp: { status: 'confirmed', value: '+34635648872' } as ValidatedField<string>,
  phone: { status: 'confirmed', value: '+34635648872' } as ValidatedField<string>,
  email: pendingField(),
  pickup: {
    status: 'confirmed',
    value: 'Campo de Los Pacos, Fuengirola; ubicación acordada previamente.',
  } as ValidatedField<string>,
};

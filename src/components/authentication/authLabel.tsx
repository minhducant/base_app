
export const getRegisterLabel = (t: (key: string) => string) => ({
  name_mobile: {
    valueInit: '',
    title: t('full_name'),
    placeholder: `${t('input')} ${t('full_name').toLowerCase()}`,
    required: true,
  },
  password: {
    valueInit: '',
    title: t('password'),
    placeholder: `${t('input')} ${t('password').toLowerCase()}`,
    required: true,
  },
  re_password: {
    valueInit: '',
    title: t('re_password'),
    placeholder: `${t('re_password')}`,
    required: true,
  },
  birthday: {
    valueInit: '',
    title: `${t('select')} ${t('birthday').toLowerCase()}`,
    placeholder: 'dd/mm/yyyy',
  },
  address: {
    valueInit: '',
    title: `${t('address')}`,
    placeholder: `${t('input')} ${t('address').toLowerCase()}`,
    multiline: true,
  },
  phone: {
    valueInit: '',
    title: t('phone_number'),
    placeholder: `${t('input')} ${t('phone_number').toLowerCase()}`,
    keyboardType: 'number-pad',
  },
  email: {
    valueInit: '',
    title: t('email'),
    placeholder: `${t('input')} ${t('email').toLowerCase()}`,
    required: true,
  },
  zip_code: {
    valueInit: '',
    title: 'Zip Code',
    placeholder: `${t('input')} zip code`,
  },
});

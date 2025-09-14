import {Platform} from 'react-native';
import {isArray, isObject} from 'underscore';

export const extraParams = (body: any) => {
  if (Object.keys(body).length === 0) {
    return '';
  }
  let length = Object.keys(body).length;
  let query = '?';
  Object.keys(body).map((key: string, index) => {
    if (body[key] || body[key] === 0 || body[key] === '') {
      if (isArray(body[key])) {
        query +=
          `${key}=${encodeURIComponent(JSON.stringify(body[key]))}` +
          (index + 1 !== length ? '&' : '');
      } else {
        query +=
          `${key}=${encodeURIComponent(body[key])}` +
          (index + 1 !== length ? '&' : '');
      }
    }
  });
  return query;
};

export const extraBodyMedia = (media = {}) => {
  try {
    const form = new FormData();
    if (isObject(media)) {
      Object.keys(media).forEach(field => {
        let data = media[field];
        if (isArray(data)) {
          data.forEach(file => {
            const dataString = JSON.stringify({
              name: file?.name ?? file?.fileName ?? 'noname',
              type: file?.type ?? 'image/jpg',
              size: file?.fileSize,
              uri:
                Platform.OS === 'ios'
                  ? file?.uri.replace('file://', '')
                  : file?.uri,
            });

            form.append(field, dataString);
          });
        } else if (isObject(data)) {
          const dataString = JSON.stringify({
            name: data?.name ?? data?.fileName ?? 'noname',
            type: data?.type ?? 'image/jpg',
            size: data?.fileSize,
            uri:
              Platform.OS === 'ios'
                ? data?.uri.replace('file://', '')
                : data?.uri,
          });

          form.append(field, dataString);
        }
      });
    }
    return form;
  } catch (error) {}
};

export const headersPost = {
  formData: {headers: {'Content-Type': 'multipart/form-data'}},
};

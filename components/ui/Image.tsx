import {Image} from 'react-native';
import React from 'react';
import {SvgUri} from 'react-native-svg';

export const InjiImage: React.FC<{uri: string; style?: any}> = ({
  uri,
  style,
}) => {
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!uri) return;
    const hasExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(uri);

    if (hasExtension) {
      setImageUri(uri);
    } else {
      fetch(uri)
        .then(res => setImageUri(res.url))
        .catch(err => {
          console.log('Image fetch error:', err);
          setImageUri(null);
        });
    }
  }, [uri]);

  const isSvg = (uri: string) => /\.svg$/i.test(uri);

  if (!imageUri) return null;

  if (isSvg(imageUri)) {
    return <SvgUri uri={imageUri} style={style} height={60} width={60} />;
  }

  return <Image source={{uri: imageUri}} style={style} resizeMode="contain" />;
};

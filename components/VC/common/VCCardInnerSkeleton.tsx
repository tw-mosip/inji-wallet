import {Theme} from '../../ui/styleUtils';
import {Column, Row} from '../../ui';
import {Image, ImageBackground} from 'react-native';
import {VCItemField} from './VCItemField';
import React from 'react';

export const VCCardInnerSkeleton = () => {
  return (
    <ImageBackground
      source={Theme.CloseCard}
      resizeMode="stretch"
      style={Theme.Styles.vertloadingContainer}>
      <Column>
        <Row margin={'0 20 10 10'}>
          <Column>
            <ImageBackground
              imageStyle={Theme.Styles.faceImage}
              source={Theme.cardFaceIcon}
              style={Theme.Styles.closeCardImage}></ImageBackground>
          </Column>
          <Column margin={'0 0 0 20'}>
            {
              <>
                <VCItemField
                  key={'empty2'}
                  fieldName={'empty'}
                  fieldValue={'empty'}
                  verifiableCredential={null}
                  wellknown={null}
                />
                <VCItemField
                  key={'empty2'}
                  fieldName={'empty'}
                  fieldValue={'empty'}
                  verifiableCredential={null}
                  wellknown={null}
                />
              </>
            }
          </Column>
        </Row>

        <Column margin="0 8 5 8">
          <VCItemField
            key={'empty3'}
            fieldName={'empty'}
            fieldValue={'empty'}
            verifiableCredential={null}
            wellknown={null}
          />
        </Column>
        <Row align={'space-between'} margin="0 8 5 8">
          <VCItemField
            key={'empty3'}
            fieldName={'empty'}
            fieldValue={'empty'}
            verifiableCredential={null}
            wellknown={null}
          />
          <Image
            source={Theme.MosipSplashLogo}
            style={Theme.Styles.logo}
            resizeMethod="scale"
            resizeMode="contain"
          />
        </Row>
      </Column>
    </ImageBackground>
  );
};

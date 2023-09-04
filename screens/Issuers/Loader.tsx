import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView } from 'react-native';
import PaginationDot from 'react-native-animated-pagination-dot';
import { Button, Centered, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';

export const Loader: React.FC<ProgressingProps> = (props) => {
  const { t } = useTranslation('ScanScreen');

  const n = 0;
  const [curPage, setCurPage] = useState(n);

  return (
    <Fragment>
      <Row elevation={3}>
        <SafeAreaView style={Theme.ModalStyles.header}>
          <Row fill align={'flex-start'} margin={'16 0 17 0'}>
            <Text style={Theme.TextStyles.header}>{props.title}</Text>
          </Row>
        </SafeAreaView>
      </Row>
      <Centered crossAlign="center" fill>
        <Column margin="24 0" align="space-around">
          <Image
            source={Theme.InjiProgressingLogo}
            height={2}
            width={2}
            style={{ marginBottom: 15, marginLeft: -6 }}
          />
          {props.progress && (
            <PaginationDot
              activeDotColor={'black'}
              curPage={curPage}
              maxPage={3}
            />
          )}
        </Column>

        <Column style={{ display: props.hint ? 'flex' : 'none' }}>
          <Column style={Theme.SelectVcOverlayStyles.timeoutHintContainer}>
            <Text
              align="center"
              color={Theme.Colors.TimoutText}
              style={Theme.TextStyles.bold}>
              {props.hint}
            </Text>
            {props.onCancel && (
              <Button
                type="clear"
                title={t('common:cancel')}
                onPress={props.onCancel}
              />
            )}
          </Column>
        </Column>
      </Centered>
    </Fragment>
  );
};

export interface ProgressingProps {
  isVisible: boolean;
  title?: string;
  label?: string;
  hint?: string;
  onCancel?: () => void;
  requester?: boolean;
  progress?: boolean | number;
  onBackdropPress?: () => void;
}

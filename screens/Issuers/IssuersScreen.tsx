import React, { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { Issuer } from '../../components/Issuer/Issuer';
import { ProgressingModal } from '../../components/ProgressingModal';
import { ErrorModal } from '../../components/ui/ErrorModal';
import { Theme } from '../../components/ui/styleUtils';
import { RootRouteProps } from '../../routes';
import { HomeRouteProps } from '../../routes/main';
import { useIssuerScreenController } from './IssuerScreenController';
import { Progressing } from './Progressing';

export const IssuersScreen: React.FC<HomeRouteProps | RootRouteProps> = (
  props
) => {
  const controller = useIssuerScreenController(props);
  const { t } = useTranslation('IssuersScreen');

  useLayoutEffect(() => {
    if (controller.issuers.length > 0) {
      props.navigation.setOptions({
        headerShown: true,
        headerLeft: () => (
          <Icon
            name="arrow-left"
            type="material-community"
            onPress={props.navigation.goBack}
            containerStyle={Theme.Styles.backArrowContainer}
            color={Theme.Colors.Icon}
          />
        ),
        headerTitle: t('title'),
      });
    } else {
      props.navigation.setOptions({
        headerShown: false,
      });
    }
  }, [controller.issuers]);

  const onPressHandler = (id) => {
    if (id !== 'UIN, VID, AID') {
      controller.SELECTED_ISSUER(id);
    } else {
      controller.DOWNLOAD_ID();
    }
  };

  const isGenericError = () => {
    return controller.errorMessage === 'generic';
  };

  const goBack = () => {
    controller.RESET_ERROR();
    setTimeout(() => {
      props.navigation.goBack();
    }, 0);
  };

  const getImage = () => {
    if (isGenericError()) {
      return (
        <Image
          source={Theme.SomethingWentWrong}
          style={{ width: 370, height: 150 }}
        />
      );
    }
    return <Image source={Theme.NoInternetConnection} />;
  };

  return (
    <React.Fragment>
      {controller.isLoadingIssuers && (
        <Progressing isVisible title={t('loading')} progress />
      )}
      {controller.issuers.length > 0 && (
        <FlatList
          data={controller.issuers}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Issuer
              id={item.id}
              description={item.displayName}
              onPress={() => onPressHandler(item.id)}
              {...props}
            />
          )}
          numColumns={2}
          keyExtractor={(item) => item.id}
        />
      )}
      {controller.errorMessage && (
        <ErrorModal
          isVisible={controller.errorMessage !== null}
          title={t(`errors.${controller.errorMessage}.title`)}
          message={t(`errors.${controller.errorMessage}.message`)}
          goBack={goBack}
          tryAgain={isGenericError() ? null : controller.TRY_AGAIN}
          image={getImage()}
        />
      )}
      {controller.isDownloadingCredentials && (
        <ProgressingModal
          isVisible={controller.isDownloadingCredentials}
          title={t('modal.title')}
          onCancel={controller.CANCEL}
          hint={t('modal.hint')}
          progress={true}
        />
      )}
    </React.Fragment>
  );
};

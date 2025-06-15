// hooks/useUnsavedChangesGuard.ts
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from 'expo-router';

export const useUnsavedChangesGuard = (hasChanges: boolean) => {
  const navigation = useNavigation();

  /** Walk up until we reach a navigator whose state type === 'tab' */
  const findTabParent = (nav: any): any => {
    let parent = nav?.getParent?.();
    while (parent && parent.getState?.().type !== 'tab') {
      parent = parent.getParent?.();
    }
    return parent;
  };

  useEffect(() => {
    /* --- back gesture / header back / router.back --- */
    const unsubBeforeRemove = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasChanges) return;
      e.preventDefault();
      confirm(() => navigation.dispatch(e.data.action));
    });

    /* --- bottom-tab presses --- */
    const tabParent: any = findTabParent(navigation);
    const unsubTabPress = tabParent?.addListener('tabPress', (e: any) => {
      if (!hasChanges) return;

      // if user taps the tab he’s already on, ignore
      if (e.target === navigation.getState()?.key) return;

      e.preventDefault();                         // block the switch
      const targetKey = e.target;

      confirm(() => {
        const targetRoute = tabParent
          .getState()
          .routes.find((r: any) => r.key === targetKey);
        if (targetRoute) {
          tabParent.navigate(targetRoute.name as never);
        }
      });
    });

    const confirm = (onDiscard: () => void) => {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Discard them?',
        [
          { text: "Don't leave", style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onDiscard },
        ]
      );
    };

    return () => {
      unsubBeforeRemove();
      unsubTabPress?.();
    };
  }, [navigation, hasChanges]);
};

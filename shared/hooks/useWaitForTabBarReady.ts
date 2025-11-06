import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState, useCallback} from 'react';

/**
 * Hook to wait until both the tab bar layout and screen focus are ready.
 *
 * Returns:
 * - isReady: boolean -> true when screen + tab bar are ready to render
 * - onTabBarLayout: (event) => void -> attach to your tab bar or container view
 *
 * Usage:
 * const { isReady, onTabBarLayout } = useWaitForTabBarReady();
 *
 * if (!isReady) {
 *     return // Loader or placeholder UI
 *   }
 *
 *   return (
 *     <View style={{ flex: 1 }} onLayout={onTabBarLayout}>
 *        // Actual screen UI
 *       </View>
 *   );
 */
export function useWaitForTabBarReady() {
  const isFocused = useIsFocused();
  const [tabBarReady, setTabBarReady] = useState(false);

  // Called when tab bar (or its layout container) finishes rendering
  const onTabBarLayout = useCallback(() => {
    setTabBarReady(true);
  }, []);

  // When navigating away, mark as not ready (prevents stale state)
  useEffect(() => {
    if (!isFocused) {
      setTabBarReady(false);
    }
  }, [isFocused]);

  return {isReady: isFocused && tabBarReady, onTabBarLayout};
}

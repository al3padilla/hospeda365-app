import * as Haptics from "expo-haptics";

/** Vibración corta al tocar botones y pestañas. */
export function vibrarToque() {
  void Haptics.selectionAsync().catch(() => undefined);
}

export function vibrarExito() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}

export function vibrarError() {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
}

export interface CaptureDevice {
  deviceId: string;
  label: string;
}

export async function listCaptureDevices(): Promise<{
  microphones: CaptureDevice[];
  cameras: CaptureDevice[];
}> {
  if (!navigator.mediaDevices?.enumerateDevices) {
    throw new Error("This browser does not support media device selection.");
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    microphones: devices
      .filter((device) => device.kind === "audioinput")
      .map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${index + 1}`,
      })),
    cameras: devices
      .filter((device) => device.kind === "videoinput")
      .map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${index + 1}`,
      })),
  };
}

export function selectedDevice(value: string): string | undefined {
  return value || undefined;
}
